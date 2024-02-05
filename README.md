# Maya

Maya is a chat client for LLMs to experiment with multi-agent and multi-human conversations.

It is built in React Native, with a FastAPI backend (The Oracle), and MongoDB datastore.

---------

### Todos
In progress:
- Build message refresh
- Build websockets
  - Helper function for websocket to create the right json
  - Enable websocket to route different commands
- Create new message, select AIs
- Build out discussion protocol, to allow other devs to implement a different framework
- Build out discussion on server w/ multiple LLMs
- Set chat topic

Next up:
- Audit all async/await
- Frontend api requests
- Build auth/verify/profile
- Enable fast chats - ie. if you message a string of messages the server should wait, adjust and not double respond

Backlog:
- Build web demo on maya url
- Refresh authtoken each session
- Allow custom avatars (cloudflare CDN)
- Secure storage rather than async storage
- Push notifications
- Invite ppl via sms
- Host on maya url rather than txtai.co
- Expire login codes
- Enable multiple dynos via redis/pubsub

-------

### Run, debug, deploy

#### Here's how I run things:
- Cursor IDE (VSCode w/ ChatGPT built in)
- Create VS workspace containing both "maya" and "the-oracle" repositories
- Hide everything non-essential in workspace settings, pull from finder

#### Set up several terminals in primary workspace

1. the-oracle - split terminal (backend)
  - server ```heroku local```
  - tests/types ```pytest``` and ```./scripts/types.sh```

2. maya - split terminal (frontend)
  - react ```npx react-native start --experimental-debugger```
  - ios ```npx run-ios```

3. the-oracle/maya split terminal (version control)
  - git - the oracle
  - git - maya

-------

### Updating types

Types update automagically from python into typescript!

-------

### Running the app

1. In one terminal window:



2. In another terminal window:
```
npx run-ios
```

Notes:
- Check ios version in package.json
- Replace ```ios``` with ```android``` for android

-------

### Maya backend architecture

Maya chat operates on a websocket for the following functions:
- Sending/receiving messages
- Creating/updating chats

Additionally it has the following API endpoints:
- Websocket (manages message sending/receiving and creating/updating chats)
- Refresh (updates the chat list and recent messages)
- Update profile (updates a user's username/avatar)
- Auth / verify (sms based authentication)

-------

## Installation

Install/update xcode and command line tools

Install node, watchman (via homebrew), and cocoapods (view rubygems, ruby version 2.7.x)

```
brew install node
brew install watchman
sudo gem install cocoapods
```

>See [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, if you have trouble.


----------

## Running locally

1. Local mongodb (check command to run in background)

2. Local LLM (use OpenChat 3.5 via LM Studio, run as server)

3. Offline chatbot (Deepseek coder via Ollama and VSCode Continue plugin)

```ollama run deepseek-coder:33b```