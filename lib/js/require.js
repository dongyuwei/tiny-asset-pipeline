function require(url){
    if(!require.cache[url]){
        var source = require.sourceCache[url];
        var code = new Function('exports, module', source);
        var exports = {};
        var module = {
            exports: exports
        };
        code(exports, module);
        require.cache[url] = module.exports;
        return module.exports;
    } else {
        return require.cache[url];
    }
}

require.cache = {};
require.sourceCache = {};