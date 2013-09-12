var params = process.argv.slice(2).join(" ");
var verbose = params.indexOf('-v') !== -1 || params.indexOf('-verbose') !== -1;
exports.info = function(info){
	//因为大量console.log严重影响性能,所以需要一个配置开关
	verbose && console.log(info);
};

var errors = [];

exports.error = function(err){
	errors.push(err);
};

exports.getError = function(){
	return errors;
};

exports.errorInfo = function(err){
	console.log('\033[91m' + err + '\033[0m');
};

var warnings = [];

exports.warning = function(wrn){
	if(warnings.indexOf(wrn) === -1){
		warnings.push(wrn);
	}
};

exports.getWarning = function(){
	return warnings;
};

exports.warningInfo = function(wrn){
	console.log('\033[93m' + wrn + '\033[0m');
};