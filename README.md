# Maya

Maya is a chat client for LLMs to experiment with multi-agent and multi-human conversations.

It is built in React Native, with a FastAPI backend (The Oracle), and MongoDB datastore.

---

### Todos

In progress:

- Draft has a bug where it won't reset back to empty when creating a new message

- Save context on perspectives, retrieve context from subthreads
- Update and test summarization code to handle perspective contexts

- Enable messaging in discussion (maya + alternate between two others)
- Make search results smaller
- Hide search + related when keyboard is open
- Figure out whether to stream the secondary responses - why so slow?

- Refresh needs to load the other data
- Don't request new perspective every time

- Create concept of "thread" that is linked to chatid + messageid but is it's own chat
  - Use this to update messages
  - Use protocol to differentiate
- Markdown

  - One LLM needs to be uncensored

- Add perspective data to refresh
- Share link
- Stop button

#### Next up:

- Testflight + force update
- User prompt
- Ask clarifying questions to user
- Webview for sharing
- Deeplinking for sharing
- Invite to chat
- Privacy terms (allow ppl to keep data private? on thread basis?)
- Render markdown
- Thumbs up / thumbs down data saving
- Analytics

#### User feedback

Way to request features (so I can add ideas)
“Add wisdom” to integrate into our knowledge base
“Add ideas” for the app
Way to report bugs

#### QA:

- Handle rapid chats - ie. if you message a string of messages the server should wait, adjust and not double respond
- Add test for contexts
- Oracle summary issue
- Websockets issues: 1. always reopen when app opens, 2. see why it keeps closing
- Websocket server to client sending on a multi-worker server

#### Pre-launch:

- Share functionality w/ web based viewer of chatid
- Indicators for success/failure/loading - message send, chat creation, profile update, etc
- Visual bug where some messages show with an extra empty line
- Lastrefresh functionality, so it doesn't reload chats all the time
- Hash/encrypt phone numbers
- Tests for oracle
- Ensure websocket isn't created before userid exists on client
- Cancel button to stop stream (also stop stream on server? kill web socket and restart it?)
- Create default "welcome" message for user
- OTA updates (expo?)
- Background data updates
- Update "last-refresh"
- App Icons

#### Social

- Invite to thread

#### Personalization

- Per user context / preferences
- Reading speed
- Turn off streaming

#### Confidence / annotations

- Confidence FE
- Confidence BE
- Annotation submission/retrieval
- NEED TO FIGURE OUT WHERE TO STORE CONFIDENCES IN DB (separate from perspectivedata?)
- Annotations BE
  - Dedicated collection
  - Top contributors can earn?
    Dont tell them, just give them gifts
    Don’t want ppl to contribute in order to get paid

#### Group chats

- Test real time
- Figure out how to handle contacts
- Search
- Force participant set for certain protocols, allow others
- Adding other humans in chat
- Build group protocols
- Experiment with deeper trained bots

#### Social features

- Trending topics in "new chat" page?

#### UI improvements:

- First stream response w/ bounce?

#### Experimental:

- Build web demo on maya url
- Build web editor for chatagents (login via sms code, add python for agents, or add webhooks for people to build/host their own)

#### Backlog

- Adjust reading speed in user profile
- Toggle for streaming vs replying
- Reduce space for new lines
- Markdown
- Better data / cache / download management so you're not pulling everything every time
- Refresh authtoken each session
- Swap Mongodb with async
- Audit all async/await
- Allow custom avatars (cloudflare CDN)
- Secure storage rather than async storage
- Figure out how to deal with syncing local and server in cases they get out of sync
- Push notifications
- Invite ppl via sms
- Host on maya url rather than txtai.co
- Expire login codes
- Enable multiple dynos via redis/pubsub
- Finetune chatbot on my Make School emails?

### Done

- Chatlist refresh, doing so in drawer screws with animation
- New chat doesn't work yet due to the way sidebar is rendered
- Sidebar is reverse chronological
- Profile needs to be fixed
- Build message refresh
- Build websockets
  - Helper function for websocket to create the right json
  - Enable websocket to route different commands
- Set chat topic
- Build out discussion protocol, to allow other devs to implement a different framework
- Build out discussion on server w/ multiple LLMs
- Hook up frontend
- Frontend chat and
- LLM streaming
- Speeding up streaming
- Test oracle, upload to dev server
- Run on actual phone
- Create new message, select protocol, select AIs
- 1:1 format list maps bot ID to protocol
- Perspectives FE
- Perspectives BE

---

Thought dump

- Explore "perspectives" modal
  - Offers new perspectives
  - Similar text interface as chat

Perspective
analogy
domain mapping
pattern matching
Consider this from another angle
Globalist thinking
3D UX?

- Modal view to add annotations

- Exa bot
- Eval bot
- Community notes bot

---

### Concept

Goals:

- Higher bandwidth information transfer
- Explore more perspectives // holistic perspectives
- Dead simple getting started UX (peel back layers of onion)
- Inherently social / sharable

Non goals:

- Maximize profit
- Non-text modalities (video, actions)

#### What does high bandwidth info transfer mean?

Explore information / conversations more like how our brains work. Less linear, more recursive
https://a9.io/glue-comic/
Additional LLM perspectives
Human annotations (ala community notes) to expand training data set
Dig into threads, bring context back to macro discussion
Allow threads to persist as their own things

---

### Run, debug, deploy

#### Here's how I run things:

- Cursor IDE (VSCode w/ ChatGPT built in)
- Create VS workspace containing both "maya" and "the-oracle" repositories
- Hide everything non-essential in workspace settings, pull from finder

#### Extensions

- Prettier (typescript formatting)
- ESLint (typescript linting)
- Ruff (python linting)

#### Set up several terminals in primary workspace

1. the-oracle - split terminal (backend)

- server `heroku local -f Procfile.local`
- tests/types `pytest`, `pytest -c populate.ini`, `./scripts/types.sh`

2. maya - split terminal (frontend)

- react `npx react-native start --experimental-debugger`
- ios `npx run-ios`, `npx react-native run-ios --device toshphone`, `npx react-native run-android`

3. the-oracle/maya split terminal (version control)

- git - the oracle
- git - maya

---

### Updating types

Types update automagically from python into typescript!

`./scripts/types.sh`

---

### Maya backend architecture

Maya chat operates on a websocket for the following functions:

- Sending/receiving messages
- Creating/updating chats

Additionally it has the following API endpoints:

- Websocket (manages message sending/receiving and creating/updating chats)
- Refresh (updates the chat list and recent messages)
- Update profile (updates a user's username/avatar)
- Auth / verify (sms based authentication)

### Data types

ChatInfo
Chats follow a discussion protocol
"maya" is the base protocol
"perspectives" is a protocol to offer more perspectives
"annotations" is a protocol for annotations

---

## Installation

Install/update xcode and command line tools

Install node, watchman (via homebrew), and cocoapods (view rubygems, ruby version 2.7.x)

```
brew install node
brew install watchman
sudo gem install cocoapods
```

> See [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, if you have trouble.

---

## Running locally

1. Local mongodb (check command to run in background)

2. Local LLM (use OpenChat ollama)

`ollama run openchat`

3. Offline chatbot (Deepseek coder via Ollama and VSCode Continue plugin)

`ollama run deepseek-coder:33b`
