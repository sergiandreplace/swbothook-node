var util = require('util');
var swapi = require('./swapi');


var process = async function(request) {
  const {originalRequest, result} = request;
  const requestedCharacter = result.parameters.Subject;
  const origin = processOriginalRequest(originalRequest);
  const action = result.action;
 
  let answer;
  if (requestedCharacter == null) {
      answer = "Tell me the name of a character";
  } else {
      let characters = await swapi.findPeople(requestedCharacter);
      
      if (!characters || characters.length == 0) {
        answer  = 'I don\'t know who ' + requestedCharacter + ' is'
      } else if  (characters.length > 1) {
        let allButOne = characters.slice(0, characters.length - 2)
        answer  = "Do you mean " + joinToPhrase(characters.map((character)=>character.name), "or")
        context = "out"
      } else {
        let currentCharacter = characters[0]
        answer = await getAnswerForAction(currentCharacter, action)
        context = "out"
      }
  }

  let contextOut = buildContextAnswer(requestedCharacter, answer, context);

  return contextOut;
}

var buildContextAnswer = function(requestedCharacter, answer, context) {
  return { 
    speech: answer,
    displayText: answer,
    source: 'swBot',
    contextOut: [
      {
        name: context,
        Subject: requestedCharacter,
      
      }
    ]
  }
}



var getAnswerForAction = async function(character, action) {
  let answers 
  switch(action) {
    case 'subject.set' : 
      answers = [
          `What do you want to know about ${character.name}?`,
          `Ok, what information do you want about ${character.name}?`,
          `Cool one, I know a lot of things about ${character.name}, what do you want to know?`
      ]
      break
    case 'subject.get.height': 
      answers = [
        `${character.name} is ${character.height} cm tall`,
        `${character.name} measures ${character.height} cm`
      ]
      break
    case 'subject.get.hair': 
      answers = [
        `${character.name}'s hair color is ${character.hair_color}`,
        `${character.name}'s has a ${character.hair_color} hair`,
        `${character.name}'s hair is ${character.hair_color}`
      ]
      break
    case 'subject.get.planet':
      let homeworld = await swapi.findHomeWorld(character)
      answers = [
        `${character.name} was born in ${homeworld.name}`,
        `${character.name} is from ${homeworld.name}`,
        `${character.name} comes from ${homeworld.name}`
      ]
      break
    case 'subject.get.movies':
      let movies = await swapi.getMovies(character);
      let moviesPhrase = joinToPhrase(movies, "and")
      answers = [
        `${character.name} appears in ${moviesPhrase}`,
        `You can see ${character.name} on ${moviesPhrase}`
      ]
      break
    default:
      answers = [
        `I don't know this information about ${character.name}`
      ]
  }
  return pickupRandomPhrase(answers);
}

var pickupRandomPhrase = function (array) {
  return array[Math.floor(Math.random() * Array.length)]
}

var processOriginalRequest = function(rawOriginalRequest) {
  if (!rawOriginalRequest) {
    return { 
      type : 'none',
      conversationId: null
    }
  } else if (rawOriginalRequest.source === "google") {
    return {
      type : 'google',
      conversationId: rawOriginalRequest.data.conversation.conversationId
    }
  } else if (rawOriginalRequest.source === "telegram") {
    return {
      type: 'telegram',
      conversationId: rawOriginalRequest.originalRequest.data.message.chat.id
    }
  }
}

var joinToPhrase = function(items, lastSeparator) {
  console.log(items)
  let allButOne = items.slice(0, items.length - 1)
  console.log(allButOne)
  return allButOne.join(", ") + " " + lastSeparator + " " + items[items.length - 1];
}

module.exports = {
  'process' : process
};

