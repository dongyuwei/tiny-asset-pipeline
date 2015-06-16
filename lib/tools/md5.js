var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

//同步式计算字符串md5,并且保留文件名称
var mapping = {};
exports.md5 = function(str, key) {
    var hash = crypto.createHash('md5').update(str).digest("hex").substr(0, 16); //hex为32位
    mapping[key] = hash;
    return hash;
};
exports.getMD5Mapping = function() {
    return mapping;
};

exports.writeMappingFile = function(from, to, mappingFile) {
    var file = mappingFile || path.join(to, "md5_mapping.json");
    var ext, allMapping = {};
    for (var k in mapping) {
        if( mapping.hasOwnProperty(k) ){
            ext = path.extname(k);
            allMapping[k.replace(from, '').replace(/\\/g, '/')] = mapping[k];
        }
    }
    fs.writeFileSync(file, JSON.stringify(allMapping, null, 3));
    console.log('\n######## MD5 mapping file is: ' + file + ' ########\n');
};
