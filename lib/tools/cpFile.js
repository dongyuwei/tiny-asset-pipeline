var fs = require('fs');
var writeFile = require('./writeFile.js');

module.exports = function (source, target, fromDir, conf) {
    writeFile(fs.readFileSync(source,'binary'), target, source, conf, 'binary');
};