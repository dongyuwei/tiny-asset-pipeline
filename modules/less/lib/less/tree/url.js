(function (tree) {
    var path = require('path');
    var md5Mapping = require('../../../../../lib/tools/md5.js').getMD5Mapping();

    /**
     * 计算图片在合并后的文件中相对路径: 先根据图片和父级css的相对路径计算出图片路径,然后计算该路径与顶级css路径的相对路径.
     * @param{String}rootPath: 顶级css路径(rootNode of .less @import Tree )
     * @param{String}imported: @import引用的css路径
     * @param{String}imgPath: @import引用的css文件中原始图片路径
     * */
    function relative(rootPath,imported,imgPath){
        //解决windows平台下path.relative带来的bug(先替换全部'\'为'/', 再去掉一个 '../' )
        return path.relative(rootPath,path.resolve(imported,'..',imgPath)).replace(/\\/g,'/').replace('../','');
    }

    /**
     * 计算图片绝对路径
     * @param{String}imported: @import引用的css路径
     * @param{String}imgPath: @import引用的css文件中原始图片路径
     * */
    function absolute(imported,imgPath){
        return path.resolve(path.dirname(imported),imgPath);
    }

    tree.URL = function (val, rootpath, env) {
        this.value = val;
        this.rootpath = rootpath;

        this.env = env;
    };
    tree.URL.prototype = {
        toCSS: function () {
            return "url(" + this.value.toCSS() + ")";
        },
        eval: function (ctx) {
            var val = this.value.eval(ctx), rootpath;

            // Add the base path if the URL is relative
            if (typeof val.value === "string" && !/^(?:[a-z-]+:|\/)/.test(val.value)) {
                rootpath = this.rootpath;
                if (!val.quote) {
                    rootpath = rootpath.replace(/[\(\)'"\s]/g, function(match) { return "\\"+match; });
                }
                val.value = rootpath + val.value;
            }

            var config = this.env.files._config_, img, arr;
            if(val.value.indexOf('?') !== -1){
                arr = val.value.split('?');
                img = absolute(this.env.filename, arr[0]);
                val.value = relative(config['_root_less_'], this.env.filename, arr[0]) + "?" + arr[1];
            }else if(val.value.indexOf('#') !== -1){
                arr = val.value.split('#');
                img = absolute(this.env.filename, arr[0]);
                val.value = relative(config['_root_less_'], this.env.filename, arr[0]) + "#" + arr[1];
            }else{
                img = absolute(this.env.filename, val.value);
                val.value = relative(config['_root_less_'], this.env.filename, val.value);
            }
            if(md5Mapping[img]){
                if(config.noRewriteFileName){
                    if(val.value.indexOf('?') !== -1){
                        val.value = val.value + '&v=' + md5Mapping[img];
                    }else if(val.value.indexOf('#') !== -1){
                        val.value = val.value + '&v=' + md5Mapping[img];
                    }else{
                        val.value = val.value + '?v=' + md5Mapping[img];
                    }
                }else{
                    var ext;
                    if(val.value.indexOf('?') !== -1){
                        arr = val.value.split('?');
                        ext = path.extname(arr[0]);
                        val.value = arr[0].replace(ext, '-' + md5Mapping[img] + ext) + '?' + arr[1];
                    }else if(val.value.indexOf('#') !== -1){
                        arr = val.value.split('#');
                        ext = path.extname(arr[0]);
                        val.value = arr[0].replace(ext, '-' + md5Mapping[img] + ext) + '#' + arr[1];
                    }else{
                        ext = path.extname(val.value);
                        val.value = val.value.replace(ext, '-' + md5Mapping[img] + ext);
                    }
                }
            }
            
            return new(tree.URL)(val, this.rootpath);
        }
    };

})(require('../tree'));
