var combineOne = require('./combineOne');
var writeFile = require('../tools/writeFile');
var log = require('../tools/log');

function extend(dest, from) {
    var props = Object.getOwnPropertyNames(from), destination;

    props.forEach(function (name) {
        if (typeof from[name] === 'object') {
            if (typeof dest[name] !== 'object') {
                dest[name] = {}
            }
            extend(dest[name],from[name]);
        } else {
            destination = Object.getOwnPropertyDescriptor(from, name);
            Object.defineProperty(dest, name, destination);
        }
    });

    return dest;
}

/**
 * combine and compress all .js file 
 */
module.exports = function(fromDir, toDir, jsList,conf){
    if (jsList.length > 0 ){
        log.info('process .js file......');

        jsList.forEach(function(file){
            var js = combineOne(file,extend({
                debug : false,
                root : fromDir
            },conf));
            writeFile(js,file.replace(fromDir, toDir),file,conf);
        });

        log.info('all .js files processed!');
    }
};