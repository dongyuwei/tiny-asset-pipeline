var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;
var path = require('path');
var fs = require('fs');
var crypto = require('crypto')
var removeBOMChar = require('../tools/removeBOMChar.js').removeBOMChar;

var reg = /require\s*\(\s*(['|"])([\w\-\.\/]+)\1\s*\)\s*;?/gi;

var combine = function(filePath, sourceCache, baseJsDir, config) {
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
        } catch (err) {
            console.error('error in ' + filePath + " :\n", err);
            return ';alert(\'' + 'error in ' + filePath + '\\n' + JSON.stringify(err) + '\');';
        }

        return str.replace(reg, function() {
            var key = arguments[2];
            if (key) {
                key = path.resolve(path.dirname(filePath), key);
                var combined = combine(key, sourceCache, baseJsDir, config);
                if (config['-sandbox']) {
                    combined = 'try{ ' + combined + ';}catch(e){if(window.console){window.console.error(e,"' + arguments[2] + '");}};\n'
                }
                var hash = crypto.createHash('md5').update(key).digest("hex");
                key = arguments[2] + '-' + hash;
                sourceCache[key] = combined;
                return 'require("' + key + '")\n';
            }
        }) + '\n//# sourceURL=' + path.basename(filePath);
    } else {
        console.error(filePath + ' does not exsist!');
        return ';alert("' + filePath + ' does not exsist!");';
    }
};

var requireFun = fs.readFileSync(path.resolve(path.join(__dirname, './require.js')), 'utf-8');
module.exports = function(filePath, config) {
    var sourceCache = {};
    var source = combine(filePath, sourceCache, config.root, config);
    sourceCache = config.debug ? JSON.stringify(sourceCache, null, 3) : JSON.stringify(sourceCache);
    return '(function(){\nsource\n})();'.replace('source', requireFun + '\nrequire.sourceCache = ' + sourceCache + ';\n' + source);
};
