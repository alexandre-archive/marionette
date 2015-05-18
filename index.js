var ext = require('./ext.js').ext,
    fs = require('fs'),
    http = require('http');

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
                        'Content-Type': ext.getContentType(ext.getExt(fileName).substr(1)) });
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
