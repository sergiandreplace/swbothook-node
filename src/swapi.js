var https = require('https');
var axios = require('axios');
var util = require('util');

var findPeople = async function (name, callback)  {
  var result = await axios.get(`https://swapi.co/api/people/?search=${name}`);
  return result.data.results;
}


module.exports = {
  findPeople: findPeople
}
