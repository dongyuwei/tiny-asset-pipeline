var path = require('path'), fs = require('fs');

function walk(uri,filter,files) {
	var stat = fs.lstatSync(uri);
	if(filter(uri)){
		if(stat.isFile()){
			uri = path.resolve(uri);
			switch(path.extname(uri)){
				case '.js':
					files.js.push(uri);
					break;
				case '.css':
					files.less.push(uri);
					break;
				case '.less':
					files.less.push(uri);
					break;
				default:
					files.other.push(uri);
			}
		}
		if(stat.isDirectory()){
			fs.readdirSync(uri).forEach(function(part){
				walk(path.join(uri, part),filter,files);
			});
		}
	}
	stat = null;
}

//排除basename以.或者_开头的目录|文件(如.git, .svn, _html, _psd, _a.psd等)
function defaultFilter(uri){
	var start = path.basename(uri).charAt(0);
	if(start === '.' || start === '_'){
		start = null;
		return false;
	}
	return true;
}

/**
 * 递归遍历目录文件,获取所有文件路径;并且分成 "js|less|other".
 * @param{String}rootDir
 * @param{Function}filter:过滤函数,返回false就排除目录|文件
 * @return{Object}
 * */
module.exports = function(rootDir, filter) {
	root = rootDir;
	filter = filter || defaultFilter;
	
	var files = {
		less 	: [],
		js 		: [],
		other 	: []
	};
	
	walk(rootDir,filter,files);
	
	return files;
};
