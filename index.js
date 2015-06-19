var fs = require('fs'),
    http = require('http');

var extTypes = { 
    "bmp"   : "image/bmp",
    "css"   : "text/css",
    "gif"   : "image/gif",
    "htm"   : "text/html",
    "html"  : "text/html",
    "ico"   : "image/vnd.microsoft.icon",
    "jpeg"  : "image/jpeg",
    "jpg"   : "image/jpeg",
    "js"    : "application/javascript",
    "json"  : "application/json",
    "png"   : "image/png",
    "svg"   : "image/svg+xml",
    "svgz"  : "image/svg+xml",
    "swf"   : "application/x-shockwave-flash",
    "text"  : "text/plain",
    "txt"   : "text/plain",
    "xml"   : "application/xml"
};

function getExt(path) {
    var i = path.lastIndexOf('.');
    return (i < 0) ? '' : path.substr(i);
}

function getContentType(ext) {
    return extTypes[ext.toLowerCase()] || 'application/octet-stream';
}

http.createServer(function (request, response) {
    console.log('%s %s', request.method, request.url);

    var fileName = request.url;

    if (request.url == '/') {
        fileName = './index.html';
    } else {
        fileName = './' + fileName;
    }

    fs.exists(fileName, function (exists) {
        if (exists) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    console.log(err);
                    response.writeHead(500);
                    response.write('Internal Server Error.');
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Length': data.length,
                        'Content-Type': getContentType(getExt(fileName).substr(1)) });
                    response.write(data);
                    response.end();
                }
            });
        } else {
            response.writeHead(404);
            response.write('Not Found.');
            response.end();
        }
    });

}).listen(8000, '0.0.0.0', 511, function () {
    console.log('Server started.\nRunning at http://localhost:8000\nPress Ctrl + C to stop.\n');
});
