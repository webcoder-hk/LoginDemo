/**************************
 * Login Demo Server
 * Author: Xue Tao
 * Date:   2018-11-18
 * Mail:   mail2xt@163.com
 **************************/
 
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path');
var crypto = require('crypto');
var util =require('util');
var host = 'localhost';
var port = 8080;
console.log('Server started. Please visit "http://'+host+':'+port+'" in your browser.');

function authentication(account){
    var validUser = {user:'admin',pw:'202cb962ac59075b964b07152d234b70'}; //pw:123
    var result = {user:'',errMsg:'',isLogin:'false',keepIn:'false'};
    var hash = crypto.createHash('md5');
    account.pw = hash.update(account.pw).digest('hex');
    if (account.user != validUser.user) {
        result.user = account.user;
        result.errMsg = 'ERROR: Wrong username!';
    } else if (account.pw != validUser.pw) {
        result.user = account.user;
        result.errMsg = 'ERROR: Wrong password!';
    } else {
        result.user = account.user;
        result.isLogin = 'true';
        result.keepIn = account.keepIn;
    }
    return util.inspect(result);
}

http.createServer(function(req, res){
    var pathname = url.parse(req.url).pathname.substr(1);
    var contentTypes = {
        html:"text/html",
        js:"text/javascript",
        css:"text/css",
        gif:"image/gif",
        jpg:"image/jpeg",
        png:"image/png",
        ico:"image/icon",
        txt:"text/plain",
        json:"application/json"
    };
    var ext = path.extname(pathname).substr(1);
    if (ext==='' && pathname=='') {
        pathname = 'entry.html';
        ext = 'html';
    }
    var contentType = "application/octet-stream";
    if (contentTypes.hasOwnProperty(ext)) {
        contentType = contentTypes[ext];
    }
    if (ext === '' && pathname==='login') {
        var post = '';
        req.on('data', function(chunk) {
            post += chunk;
        });
        
        req.on('end', function(){
            post = qs.parse(post);
            var result = authentication(post);
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(result);
        });
    }
    
    fs.exists(pathname, function(exists) {
        if(exists){
            res.writeHead(200, {"content-type":contentType});
            var stream = fs.createReadStream(pathname,{flags:"r",encoding:null});
            stream.on("error", function() {
                res.writeHead(500,{"content-type": "text/html"});
                res.end("<h1>500 Server Error</h1>");
            });
            stream.pipe(res);
        }
    });

}).listen(port);
