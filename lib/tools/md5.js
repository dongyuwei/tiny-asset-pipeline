var fs = require('fs'), path = require('path'), crypto = require('crypto');

//同步式计算字符串md5,并且保留文件名称
var mapping = {};
exports.md5 = function(str,key){
	var hash = crypto.createHash('md5').update(str).digest("hex").substr(0,16);//hex为32位
	mapping[key] = hash;
	return hash;
};
exports.getMD5Mapping = function(){
	return mapping;
};

var jsAndCssMapping = {};
exports.writeMappingFile = function(from,to){
	var file = path.join(to ,"md5_mapping.json");
	var ext;
	for(var k in mapping){
		ext = path.extname(k);
		if(ext === '.js' || ext === '.css'){
			jsAndCssMapping[k.replace(from,'').replace(/\\/g,'/')] = mapping[k];
		}
	}
	fs.writeFileSync(file,JSON.stringify(jsAndCssMapping,null,3));
	console.log('\n######## MD5 mapping file is: ' + file + ' ########\n');
};

exports.getJsAndCssMapping = function(){
	return jsAndCssMapping;
};