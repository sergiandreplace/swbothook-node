# Star Wars bot

This is the code needed to run the Star Wars bot. It will create a Dialog Flow agent with a webhook able to answer questions about Star Wars Characters.

## Setup

Clone this repo into your disk. There are two main parts to setup, the Dialog Flow agent and the webhook.

### Dialog Flow

Create a new agent in Dialog Flow and import the file SWBot.zip. This file contains all nedeed intents and entities.

### Webhook

The webhook is a node app.

Ensure to be using the latest version of NodeJs. And, once downloaded the project, execute ```npm install``` to update dependencies.

You can start it with the command ```npm run start``` or ```npm run startdev```. Both will run the server, but the second one restarts it automatically if you change any file or something fails.


## ngrok

When the server starts, it uses ngrok to create a tunnel to make you local server accessible from internet. Once started, you'll see a message in the console like this:

```
Running at https://5db5787f.ngrok.io
Check traffic at http://127.0.0.1:4040/
```

In this case, you must use https://5db5787f.ngrok.io as your webhook url in DialogFlow (in your agent, go to section Fullfillment).

This creates an open tunnel to your machine, securing it is up to you.

Also, you can use the url http://127.0.0.1:4040/ to check the requests and responses received through the tunnel and also to resend requests (Great for debugging)
