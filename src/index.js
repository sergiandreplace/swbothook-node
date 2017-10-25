var express = require('express');
var action = require('./action');
var bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());

app.post("/",   function(req, res)  {

    body = req.body
    console.clear()
    console.log(body)
    action.process(body)
    .then(function(response) { 
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.send(response)
    })
})

app.listen(process.env.PORT || 8080);;

