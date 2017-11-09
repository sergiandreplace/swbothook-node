var util = require('util');
var swapi = require('./swapi');


var process = async function(request) {
  const {originalRequest, result} = request;
  const characterName = result.parameters.Subject;
  const origin = processOriginalRequest(originalRequest);
  const action = result.action;
 
  var answer;
  if (characterName == null) {
      answer = "Tell me the name of a character";
  } else {
      var characters = await swapi.findPeople(characterName);
      var answer = await getAnswerFor(characters, action);
  }

  var contextOut = buildContextAnswer(characterName, answer);

  return contextOut;
}

var buildContextAnswer = function(characterName, answer) {
  return { 
    speech: answer,
    displayText: answer,
    source: 'swBot',
    contextOut: [
      {
        name: 'out',
        Subject: characterName,
      
      }
    ]
  }
}

var getAnswerFor = async function (characters, action) {
  if (characters.length > 1) {
    return "Do you mean " + characters.map((character)=>character.name).join(", ");
  }
  if (characters.length == 0) {
    return 'I don\'t know who ' + characterName + ' is'
  }

  return await getAnswerForAction(characters[0], action);
  
}

var getAnswerForAction = async function(character, action) {
  var homeworld = await swapi.findHomeWorld(character);  
  console.log(homeworld)
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
      `${character.name}'s hair color is ${character.hair}`,
      `${character.name}'s has a ${character.hair} hair`,
      `${character.name}'s hair is ${character.hair}`
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

