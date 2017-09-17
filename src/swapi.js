var https = require('https');

var findPeople = function (name, callback) {
  https.get("https://swapi.co/api/people/?search=" + name, (res) => {
    readBody(res, (body) => callback(body));
  });
}



var readBody = function (res, callback) {
  let rawData = '';

  res.on('data', (chunk) => { rawData += chunk; });

  res.on('end', () => {
    const parsedData = JSON.parse(rawData);
    callback(parsedData.results);
  });

}

module.exports = {
  findPeople: findPeople
}