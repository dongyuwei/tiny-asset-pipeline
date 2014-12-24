var fs = require('fs');
var writeFile = require('./writeFile.js');

module.exports = function (source, target, fromDir, conf) {
    var file = fs.readFileSync(source,'binary');
    fs.writeFileSync(target, file, encode || 'utf-8');//copy raw assets

    writeFile(file, target, source, conf,'binary');
    file = null;
};