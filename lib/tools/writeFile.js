var fs = require('fs');
var path = require('path');
var log  = require('./log');
var md5 = require('./md5').md5;

module.exports = function(content, target, source, conf, encode){
    encode = encode || 'utf-8';
    
    fs.writeFileSync(target, content, encode);//copy raw assets

    var hash = md5(content,source);
    var ext = path.extname(target);
    target = target.replace(new RegExp(ext + '$'), '-' + hash + ext);
    fs.writeFileSync(target, content, encode);
    log.info('> write to ' + target );
};
