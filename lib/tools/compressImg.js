var path = require('path'), fs = require('fs');
var exec = require('child_process').exec;

function compress(file){
    var initSize = fs.statSync(file).size;
    var cmd = ['pngquant', '--ext .png','--force',file].join(' ');
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            throw error;
        }
        var newSize = fs.statSync(file).size;
        console.log(file + " init size: " + initSize, " new size: " + newSize);
    });
}

function walk(uri,filter) {
    var stat = fs.lstatSync(uri);
    if(filter(uri)){
        if(stat.isFile()){
            //转换成绝对路径
            uri = path.resolve(uri);
            switch(path.extname(uri)){
                case '.png':
                    compress(uri);
                    break;
            }
        }
        if(stat.isDirectory()){
            fs.readdirSync(uri).forEach(function(part){
                walk(path.join(uri, part),filter);
            });
        }
    }
    stat = null;
}

//排除basename以.或者_开头的目录|文件(如.svn,,git,_psd等)
function filter(uri){
    var start = path.basename(uri).charAt(0);
    if(start === '.' || start === '_'){
        start = null;
        return false;
    }
    return true;
}

if(process.argv.length === 2){
    console.error('#Usage#: node compressImg.js dir');
    process.exit(1);
}else{
    walk(process.argv[2],filter);
}