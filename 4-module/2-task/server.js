const url = require('url');
const http = require('http');
const path = require('path');
const fs =require('fs');
const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const limitedStream = new LimitSizeStream({limit: 1000000});

  switch (req.method) {
    case 'POST':
      const myStream = fs.createWriteStream(filepath, {flags: 'wx'});
      req.pipe(limitedStream).pipe(myStream);

      myStream.on('close', function() {
        res.statusCode = 201;
        res.end('ok');
      });

      limitedStream.on('error', function(err) {
        res.statusCode = 413;
        res.end('*** file is too large ***');
        fs.unlink(filepath, () => {});
      });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, function() {
          res.end('*** connectione failed ***');
        });
      });

      myStream.on('error', function(err) {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('*** file already exists ***');
        } else {
          res.statusCode = 500;
          res.end('*** internal error ***');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
