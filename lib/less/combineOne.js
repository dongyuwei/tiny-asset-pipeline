var path = require('path');
var fs = require('fs');
var autoPrefixer = require('autoprefixer');
var less = require('./monkeyPatchedLessc.js')();

less.logger.addListener({
    error: function(msg) {
        console.error(msg);
    }
});

module.exports = function(config){
    var file = config.file;
    if(fs.existsSync(file)){
        var data = fs.readFileSync(file,'utf8');
        var options = {
            paths           : [path.dirname(file)],
            filename        : file,
            syncImport      : true,
            processImports  : true,
            compress        : true
        };

        if(config.debug){//development environment
            options.compress = false;
            if(config.sourceMap){
                options.sourceMap = {
                    sourceMapFileInline : true,
                    outputSourceFiles : true
                };
            }
        }
        less.render(data, options, function(error, output) {
            if(error){
                return onLessError(error,config);
            }

            // output.css = string of css
            // output.map = string of sourcemap
            // output.imports = array of string filenames of the imports referenced
            var css = output.css;
            if(typeof css === 'string'){
                css = autoPrefixer.process(css, { browsers: config.browsers }).css;
                config.callback && config.callback(css);
            }
        });

    }else{
        console.error('cannot find ', file);
        if(config.res){
            config.res.send(404, 'Sorry,cannot find ' + file + ' <a href="/">return</a>');
        }
    }
}

function onLessError(e,config){
    if(e){
        if(config.res){
            config.res.end('<pre style="color:red;">Error when handle ' + config.file + ' : ' + JSON.stringify(e,null,3) + '</pre>');
        }
        less.writeError(e);
        throw e;
    }
}