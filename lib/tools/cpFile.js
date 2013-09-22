var fs = require('fs');
var path = require('path');
var md5 = require('./md5');
var writeFile = require('./writeFile.js');

var file;
module.exports = function (source, target,fromDir,conf) {
	file = fs.readFileSync(source,'binary');
    writeFile(file, target,source,conf,'binary');
    file = null;
};