var https = require('https');
var axios = require('axios');
var util = require('util');

var movies = {
  1: "A New Hope",
  2: "The Empire Strikes Back",
  3: "Return of the Jedi",
  4: "The Phantom Menace",
  5: "Attack of the Clones",
  6: "Revenge of the Sith",
  7: "The force awakens",
}

var findPeople = async function (name)  {
  var result = await axios.get(`https://swapi.co/api/people/?search=${name}`);
  return result.data.results;
}

var findHomeworld = async function(person) {
  let result = await axios.get(person.homeworld);
  return result.data;
}

var getMovies = async function(person) {
  return person.films
    .map(filmUrl => filmUrl.substr(-2,1))
    .sort()
    .map(filmId => movies[filmId])
}


module.exports = {
  findPeople: findPeople,
  findHomeWorld: findHomeworld,
  getMovies: getMovies
}
