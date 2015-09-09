var path = require('path');
var combineOne = require('./combineOne');
var writeFile = require('../tools/writeFile');
var log = require('../tools/log');

/**
 * combine and compress all .less file to .css
 */
module.exports = function(fromDir, toDir, lessList,conf){
    //获取缓存的文件列表
    log.info('parse .css(.less) file......');



    lessList.forEach(function(file){
        //对内容进行合并
        combineOne({
            file            : file,
            debug           : false,
            browsers        : (conf['-browsers'] || "> 1%, last 2 versions, Firefox ESR, Opera 12.1").replace(/^\s+|\s+$/g,"").split(/\s*,\s*/),
            opts            : conf['-opts'] && optsProcess(conf['-opts']) || {},
            cdnHost         : conf.cdnHost,
            documentRoot    : path.dirname(fromDir),
            callback        : function(css){//进行写文件操作
                writeFile(css,file.replace(fromDir, toDir),file,conf);
            }
        });
    });

    log.info('all .css(.less) files processed!');
};

function optsProcess(opts){
    var optsArray = opts.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/), optsObj = {};

    for(var i = 0; i < optsArray.length; i++){
        var paraArray = optsArray[i].split('=');
        optsObj[paraArray[0]] = strBool2bool(paraArray[1]);
    }

    return optsObj;
}

function strBool2bool(str){
    var bool;

    if(str === 'true'){
        bool = true;
    }else if(str === 'false'){
        bool = false;
    }else{
        bool = str;
    }

    return bool;
}