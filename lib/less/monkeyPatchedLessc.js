var less = require('less');
var path = require('path');
var md5Mapping = require('../tools/md5.js').getMD5Mapping();

/**
 * 计算asset在合并后的文件中相对路径: 先根据asset和父级css的相对路径计算出asset路径,然后计算该路径与顶级css路径的相对路径.
 * @param{String}rootPath: 顶级css路径(rootNode of .less @import Tree )
 * @param{String}imported: @import引用的css路径
 * @param{String}asset: @import引用的css文件中原始asset路径
 * */
function relative(rootPath,imported,asset){
    //解决windows平台下path.relative带来的bug(先替换全部'\'为'/', 再去掉一个 '../' )
    return path.relative(rootPath,path.resolve(imported,'..',asset)).replace(/\\/g,'/').replace('../','');
}

/**
 * 计算asset绝对路径
 * @param{String}imported: @import引用的css路径
 * @param{String}asset: @import引用的css文件中原始asset路径
 * */
function absolute(imported, asset){
    return path.resolve(path.dirname(imported), asset);
}

function patchImport(less){
    var Import = less.tree.Import;
    less.tree.Import = function(path, features, options, index, currentFileInfo){
        options.less = true;
        options.inline = false;
        this.options = options;
        this.index = index;
        this.path = path;
        this.features = features;
        this.currentFileInfo = currentFileInfo;

        this.css = false;
    };
    less.tree.Import.prototype = Import.prototype;
}

function patchURL(less){
    var URL = less.tree.URL;
    URL.prototype.eval = function (context) {
        var val = this.value.eval(context),
            rootpath;

        if (!this.isEvald) {
            // Add the base path if the URL is relative
            rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;
            if (rootpath &&
                typeof val.value === "string" &&
                context.isPathRelative(val.value)) {

                if (!val.quote) {
                    rootpath = rootpath.replace(/[\(\)'"\s]/g, function(match) { return "\\" + match; });
                }
                val.value = rootpath + val.value;
            }

            val.value = context.normalizePath(val.value);

            // Add url args if enabled
            if (context.urlArgs) {
                if (!val.value.match(/^\s*data:/)) {
                    var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
                    var urlArgs = delimiter + context.urlArgs;
                    if (val.value.indexOf('#') !== -1) {
                        val.value = val.value.replace('#', urlArgs + '#');
                    } else {
                        val.value += urlArgs;
                    }
                }
            }
        }

        val.value = relative(this.currentFileInfo.rootFilename, this.currentFileInfo.filename, val.value);
        var assetPath = absolute( this.currentFileInfo.filename, val.value.split(/\?|#/)[0] );
        var hash = md5Mapping[assetPath];
        if(hash){
            var ext, arr;
            if(val.value.indexOf('?') !== -1){
                arr = val.value.split('?');
                ext = path.extname(arr[0]);
                val.value = arr[0].replace(ext, '-' + hash + ext) + '?' + arr[1];
            }else if(val.value.indexOf('#') !== -1){
                arr = val.value.split('#');
                ext = path.extname(arr[0]);
                val.value = arr[0].replace(ext, '-' + hash + ext) + '#' + arr[1];
            }else{
                ext = path.extname(val.value);
                val.value = val.value.replace(ext, '-' + hash + ext);
            }
        }
        return new URL(val, this.index, this.currentFileInfo, true);
    };
}

module.exports = function(){
    patchImport(less);
    patchURL(less);

    return less;
};