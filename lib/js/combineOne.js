var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;
var path = require('path');
var fs = require('fs');
var removeBOMChar = require('../tools/removeBOMChar.js').removeBOMChar;

var reg = /require\s*\(\s*(['|"])([\w\-\.\/]+)\1\s*\)\s*;?/gi;

var combine = function(filePath, beCombined, baseJsDir, config, tree) {
    tree['root'] = filePath.replace(baseJsDir, '');
    tree['children'] = [];

    if (fs.existsSync(filePath)) {
        var str = fs.readFileSync(filePath, 'utf-8');
        str = removeBOMChar(str);
        try {
            var ast = jsp.parse(str);
            if (!config.debug) {
                var mangleOpt = {};
                if (config['--reserved-names']) {
                    mangleOpt.except = config['--reserved-names'].split(',');
                }
                ast = pro.ast_mangle(ast, mangleOpt);
                ast = pro.ast_squeeze(ast, {
                    make_seqs: false,
                    dead_code: true,
                    no_warnings: false,
                    keep_comps: true
                });
            }
            str = pro.gen_code(ast, {
                'beautify': config.debug
            });
            ast = null;
        } catch (err) {
            console.error('error in ' + filePath + " :\n", err);
            return ';alert(\'' + 'error in ' + filePath + '\\n' + JSON.stringify(err) + '\');';
        }

        return str.replace(reg, function() {
            var key = arguments[2];
            if (key) {
                key = path.resolve(path.dirname(filePath), key);
                if (beCombined[key] !== 0) {
                    var subTree = {
                        'root': arguments[2],
                        'children': []
                    };
                    tree['children'].push(subTree);

                    beCombined[key] = 0;

                    var combined = combine(key, beCombined, baseJsDir, config, subTree);
                    if (config['-sandbox']) {
                        combined = 'try{ ' + combined + ';}catch(e){if(window.console){window.console.error(e,"' + arguments[2] + '");}};\n'
                    }
                    return combined;
                } else {
                    return ' '; //忽略重复require()
                }
            }
        }) + ';\n';
    } else {
        console.error(filePath + ' does not exsist!');
        return ';alert("' + filePath + ' does not exsist!");';
    }
};
/*
 * 用于开发模式下合并单个js文件,不压缩
 * @param{String}filePath : js文件的#绝对路径#
 * @param{Object}config : {debug:true,root:'/data/ria/mobile'} 控制是否压缩|格式化代码
 * @return{String}合并后的js内容.
 */
module.exports = function(filePath, config) {
    var beCombined = {},
        tree = {};
    var js = combine(filePath, beCombined, config.root, config, tree);

    if (config.debug) {
        return '/*\n' + JSON.stringify(tree, null, 3) + '\n*/\n' + js;
    } else {
        return js;
    }
};
