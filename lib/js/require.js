function require(url){
    if(!require.cache[url]){
        var source = require.sourceCache[url];
        var exports = {};
        var module = {
            exports: exports
        };
        new Function('exports, module', source)(exports, module);
        require.cache[url] = module.exports;
        return module.exports;
    } else {
        return require.cache[url];
    }
}

require.cache = {};
require.sourceCache = {};

if (typeof global !== 'undefined'){
    global.require = require;
}
