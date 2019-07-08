const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const myStream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':

      if (filepath.match(req.url)) myStream.pipe(res);

      myStream.on('error', (err) => {
        if (pathname.includes('/')) {
          res.statusCode = 400;
          res.end('*** BAD REQUEST ***');
        } else if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('*** FILE NOT FOUND ***');
        } else {
          res.statusCode = 500;
          res.end('*** SMTH WENT WRONG ***');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
