var http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("hellooooo");
}).listen(8080);

console.log("hello world");
