var util = require('util');
var swapi = require('./swapi');


var process = async function(request) {
  const {originalRequest, result} = request;
  
  const origin = processOriginalRequest(originalRequest);
  
  const requestedCharacter = result.parameters.Subject;
  const action = result.action;

  let answer;
  let characters = [];
  let context;
  if (!requestedCharacter) {
      answer = "Tell me the name of a character";
  } else {
      characters = await swapi.findPeople(requestedCharacter);
      
      if (!characters || characters.length == 0) {
        answer  = 'I don\'t know who ' + requestedCharacter + ' is'
      } else if  (characters.length > 1) {
        let allButOne = characters.slice(0, characters.length - 2)
        answer  = "Do you mean " + allButOne.map((character)=>character.name).join(", ") + "or " + characters[characters.length - 1].name;
        context = "out"
      } else {
        answer = await getAnswerForAction(characters[0], action)
        context = "out"
      }
  }

  var contextOut = buildContextAnswer(requestedCharacter, answer, context);

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
  var homeworld = await swapi.findHomeWorld(character);  
  var answers = {
    'subject.set' : [
        `What do you want to know about ${character.name}?`,
        `Ok, what information do you want about ${character.name}?`,
        `Cool one, I know a lot of things about ${character.name}, what do you want to know?`
    ],
    'subject.get.height': [
        `${character.name} is ${character.height} cm tall`,
        `${character.name} measures ${character.height} cm`
    ],
    'subject.get.hair': [
      `${character.name}'s hair color is ${character.hair_color}`,
      `${character.name}'s has a ${character.hair_color} hair`,
      `${character.name}'s hair is ${character.hair_color}`
    ],
    'subject.get.planet': [
      `${character.name} was born in ${homeworld.name}`,
      `${character.name} is from ${homeworld.name}`,
      `${character.name} comes from ${homeworld.name}`
    ],
  }
  return pickupRandomPhrase(answers[action]);
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

module.exports = {
  'process' : process
};

