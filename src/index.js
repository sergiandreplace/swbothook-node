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

    action.process(JSON.parse(body))
    .then(response => {
        console.log(JSON.stringify(response));
        res.end(JSON.stringify(response))
    })
    .catch(e => {
      console.log(e);
      res.end(JSON.stringify(e));
    });
    
  });
}).listen(process.env.PORT || 8080);;

