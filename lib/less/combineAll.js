var path = require('path');
var combineOne = require('./combineOne');
var writeFile = require('../tools/writeFile');
var log = require('../tools/log');

/**
 * combine and compress all .less file to .css
 */
module.exports = function(fromDir, toDir, lessList,conf){
    //获取缓存的文件列表
    log.info('parse .less file......');

    lessList.forEach(function(file){
        //对内容进行合并
        combineOne({
            file            : file,
            debug           : false,
            cdnHost         : conf.cdnHost,
            documentRoot    : path.dirname(fromDir),
            callback        : function(css){//进行写文件操作
                log.info('parse ' + file + ' done!');

                file = file.replace('.less','.css')
                writeFile(css,file.replace(fromDir, toDir),file,conf);
            },
            noRewriteFileName : conf['-noRewriteFileName']
        });
    });

    log.info('all .less files processed!');
};