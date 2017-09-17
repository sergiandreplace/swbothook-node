var http = require('http');
var action = require('./action');

http.createServer((req, res) => {
  const { headers, method, url } = req;
  let body = [];

  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // BEGINNING OF NEW STUFF

    

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.on('error', (err) => {
      console.error(err);
    });

    action.process(JSON.parse(body), (response) => res.end(response));

  });
}).listen(process.env.PORT || 8080);;

