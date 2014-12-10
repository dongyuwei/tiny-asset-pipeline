//因为大量console.log严重影响性能,所以需要一个配置开关
var params = process.argv.slice(2).join(" ");
var verbose = params.indexOf('-v') !== -1 || params.indexOf('-verbose') !== -1;

exports.log = function() {
    verbose && console.log.apply(console, [].slice.call(arguments, 0) );
};

exports.info = function() {
    verbose && console.info.apply(console, [].slice.call(arguments, 0) );
};

exports.warn = function() {
    verbose && console.warn.apply(console, [].slice.call(arguments, 0) );
};