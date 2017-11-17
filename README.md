# Star Wars bot

This is the code needed to run the Star Wars bot. It will create a Dialog Flow agent with a webhook able to answer questions about Star Wars Characters.

## Setup

Clone this repo into your disk. There are two main parts to setup, the Dialog Flow agent and the webhook.

### Dialog Flow

Create a new agent in Dialog Flow and import the file SWBot.zip. This file contains all nedeed intents and entities.

### Webhook

The webhook is a node app. You can start it with the command ```npm run start``` or ```npm run startdev```. Both will run the server, but the second one restarts it automatically if you change any file or something fails.

Remember to install the dependencies before running it.

You will have to setup the webhook url in Dialog Flow once running.

## ngrok

If you want to run it locally, I recommend using ngrok. Just download it and execute ```ngrok http 8080``` to create an http tunnel to your local 8080 port (where the webhook is running).

Once you have an url, set it up in Dialog Flow.

Check additional options for security on ngrok documentation