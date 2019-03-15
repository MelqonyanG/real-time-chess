# real-time-chess

real-time-chess is a chess app, that allow:

  - select username for game
  - create new game chellange
  - refresh and see new added chellanges
  - select your wanted chellange and start game

 ### Tech

real-time-chess uses a number of open source projects to work properly:
**client side**
* React js
* Bootstrap
* socket.io-client
* chessboardjs
* chess.js

**server side**
* Python3
* Flask
* eventlet
* pymongo

### Installation

real-time-chess client side requires [Node.js](https://nodejs.org/) v4+ and [npm](https://www.npmjs.com/). Server side requires [MongoDB](https://www.mongodb.com/) database.

Install the dependencies and start the server.
1. First of all you need start mongodb server
```sh
$ sudo service mongodb start
```
2.  Then you need to start real-time-chess server
```sh
$ cd real-time-chess/
$ pip install -r requirements.txt
$ python server.py
```

Install the dependencies and start the client.
```sh
$ cd real-time-chess/client
$ npm install
$ npm start
```
Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3000
```
or
```sh
localhost:3000
```
**screenshots**
![screenshot](/screenshot_game.png)
![screenshot](/screenshot_games_list.png)
