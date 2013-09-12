var combineOne = require('./combineOne');
var writeFile = require('../tools/writeFile');
var log = require('../tools/log');

/**
 * combine and compress all .js file 
 */
module.exports = function(fromDir, toDir, jsList,conf){
    log.info('parse .js file......');

    jsList.forEach(function(file){
        var js = combineOne(file,{
            debug : false,
            root : fromDir
        });
        writeFile(js,file.replace(fromDir, toDir),file,conf);
    });

    log.info('all .js files processed!');
};