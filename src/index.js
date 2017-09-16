var http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("hellooooo from " + req.connection.localPort + " to " + req.connection.remotePort);
}).listen(process.env.PORT || 8080);

console.log("hello world");
