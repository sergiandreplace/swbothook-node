var util = require('util');
var swapi = require('./swapi');


var process = function(request, callback) {
  const {originalRequest, result} = request;
  
  const characterName = result.parameters.Subject;
  console.log("Character name=" + characterName);


  const origin = processOriginalRequest(originalRequest);
  console.log("Original Request: " + util.inspect(origin));

  const action = result.action;
  console.log("Action: " + action);
 
  var response;
  if (characterName == null) {
      callback("Tell me the name of a character");
  } else {
      swapi.findPeople(characterName, (people) => {
        callback(people[0].name);
      });
  }
}

var processOriginalRequest = function(rawOriginalRequest) {
  if (typeof rawOriginalRequest == 'undefined') {
    return { 
      type : 'none'
    }
  } else if (rawOriginalRequest.source == "google") {
    return {
      type : 'google',
      conversationId: rawOriginalRequest.data.conversation.conversationId
    }
  } else if (rawOriginalRequest.source == "telegram") {
    return {
      type: 'telegram',
      conversationId: rawOriginalRequest.originalRequest.data.message.chat.id
    }
  }
}

module.exports = {
  'process' : process
};