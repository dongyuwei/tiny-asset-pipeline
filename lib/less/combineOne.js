var path = require('path');
var fs = require('fs');
var less = require('../../modules/less/lib/less/index');

module.exports = function(config){
    var file = config.file;
    if(fs.existsSync(file)){
        var data = fs.readFileSync(file,'utf8');
        
        config['_root_less_'] = file;

        var parser = new(less.Parser)({
            // Specify search paths for @import directives (相对路径的起始目录)
            paths       : [path.dirname(file)],
            // Specify a filename, for better error messages
            filename    : file,
            syncImport  : true,
            files       : {
                '_config_' : config
            }
        });
        
        parser.parse(data,function(e,root){
            onLessError(e,config);
            var css;
            
            try{
                css = root.toCSS({
                    compress: !config.debug,
                    yuicompress: !config.debug
                });
            }catch(error){
                onLessError(error,config);
            }
            if(typeof css === 'string'){
                if(config.debug){
                    delete parser.imports.files['_config_'];
                    css = '/*\n' +  JSON.stringify(Object.keys(parser.imports.files),null,3) + '\n*/\n' + css;
                }
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