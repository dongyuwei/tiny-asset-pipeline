var path = require('path');
var fs = require('fs');
var babel = require("babel-core");
var removeBOMChar = require('../tools/removeBOMChar.js').removeBOMChar;

var reg = /require\s*\(\s*(['|"])([\w\-\.\/]+)\1\s*\)\s*;?/gi;

var combine = function(filePath, beCombined, baseJsDir, config, tree) {
    tree['root'] = filePath.replace(baseJsDir, '');
    tree['children'] = [];

    if (fs.existsSync(filePath)) {
        var str = fs.readFileSync(filePath, 'utf-8'), transformed;
        str = removeBOMChar(str);
        try {
            transformed = babel.transform(str, {
                filename: filePath,
                loose: ["es6.classes", "es6.properties.computed"],
                sourceRoot: baseJsDir,
                modules: 'ignore',
                ast: false,
                sourceMaps: false, //'inline',
                env: {
                    development: {
                        optional: []
                    },
                    production: {
                        optional: ["optimisation", "minification"]
                    }
                }
            });
        } catch (err) {
            console.error('error in ' + filePath + " :\n", err);
            return ';alert(\'' + 'error in ' + filePath + '\\n' + JSON.stringify(err) + '\');';
        }

        str = transformed.code;

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
