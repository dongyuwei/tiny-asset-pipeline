var path = require('path');
var os = require('os');
var fs = require('fs');
var express = require('express');

var combineOneJS = require('../js/combineOne');
var combineOneLess = require('../less/combineOne');

var conf = require("argsparser").parse();

var config = {
    documentRoot    : conf['-root'] && conf['-root'] !== 'undefined' ? conf['-root'] : process.cwd(),
    port            : parseInt(conf['-port'], 10) || 8888
};

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ', err);
});

var pidPath = path.join(os.tmpDir(), config.port + '.node_pid');
fs.writeFile(pidPath, process.pid);

process.on('SIGTERM', function() {
    console.log('HTTPD killed');

    fs.unlink(pidPath, function() {
        process.exit(0);
    });
});

var app = express(), isDebug = true;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("*.js",function(req, res){
    var file = path.join(config.documentRoot, req.url.split('?')[0]);
    res.header('Content-Type', 'application/x-javascript;Charset=UTF-8');
    res.end(combineOneJS(file, {
        root: config.documentRoot,
        debug: isDebug
    }), 'utf-8');
});

app.get('*.css',function(req, res){
    combineOneLessOrCss(req, res)
});

app.get("*.less", function(req, res) {
    combineOneLessOrCss(req, res);
});

function combineOneLessOrCss(req, res){
    var file = path.join(config.documentRoot, req.url.split('?')[0]);
    combineOneLess({
        file            : file,
        req             : req,
        res             : res,
        debug           : isDebug,
        sourceMap       : conf['-source-map'],
        callback        : function(css){
            res.header("Content-Type", "text/css");
            res.end(css, 'utf-8');
        }
    });
}

app.get('/favicon.ico', function(req, res) {
    res.end('');
});

if (config.documentRoot) {
    app.use(express['static'](config.documentRoot));
    app.use(express.directory(config.documentRoot));
}

app.listen(config.port);

console.log('################################################');
console.log('server (pid: ' + process.pid + ') started! please visit http://127.0.0.1:' + config.port + ' . documentRoot is: ' + config.documentRoot);
console.log('################################################');