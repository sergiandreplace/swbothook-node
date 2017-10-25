var https = require('https');
var axios = require('axios');
var util = require('util');

var findPeople = async function (name)  {
  var result = await axios.get(`https://swapi.co/api/people/?search=${name}`);
  return result.data.results;
}

var findHomeworld = async function(person) {
  var result = await axios.get(person.homeworld);
  return result.data
}


module.exports = {
  findPeople: findPeople,
  findHomeWorld: findHomeworld 
}
