var express = require('express');
var action = require('./action');
var bodyParser = require('body-parser');
const ngrok = require('ngrok');

const app = express()
app.use(bodyParser.json());

app.post("/", function (req, res) {

  body = req.body

  action.process(body)
    .then(function (response) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.send(response)
    },
      function (error) {
        console.log(error)
      })
})

app.listen(process.env.PORT || 8080);;

ngrok.connect(8080)
  .then(url => console.log(`Running at ${url}\nCheck traffic at http://127.0.0.1:4040/`))
