var fs = require('fs');
var path = require('path');
var log  = require('./log');
var md5 = require('./md5').md5;

var hash, ext;
module.exports = function(content, target,source,conf,encode){
    hash = md5(content,source);
    var keepRawName = fs.existsSync(path.join(path.dirname(source),'.keep-raw-name'));
    if(conf && !conf['-noRewriteFileName'] && !keepRawName){
        ext = path.extname(target);
        target = target.replace(new RegExp(ext + '$'), '-' + hash + ext);
    }
	fs.writeFileSync(target,content, encode || 'utf-8');
	log.info('> write to ' + target );
};
