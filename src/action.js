var util = require('util');
var swapi = require('./swapi');


var process = async function(request) {
  const {originalRequest, result} = request;
  
  const characterName = result.parameters.Subject;
  console.log("Character name=" + characterName);


  const origin = processOriginalRequest(originalRequest);
  console.log("Original Request: " + util.inspect(origin));

  const action = result.action;
  console.log("Action: " + action);
 
  var answer;
  if (characterName == null) {
      answer = "Tell me the name of a character";
  } else {
      var characters = await swapi.findPeople(characterName);
      var answer = await getAnswerFor(characters, action);
      answer;
  }

  return answer
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
    ]
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

