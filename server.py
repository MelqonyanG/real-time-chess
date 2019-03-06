from flask import Flask
import socketio
import eventlet
import json
from pymongo import MongoClient
from bson import ObjectId

with open('server_config.json') as json_data_file:
    data_server = json.load(json_data_file)

SERVER = data_server.get('server')

APP = Flask(__name__)
SIO = socketio.Server()
MONGO_CLIENT = MongoClient()
GAME_DB = MONGO_CLIENT.games


@APP.route('/')
def index():
    return render_template('index.html')


@SIO.on('connect')
def on_connect(sid, data):
    print('user connected ' + sid)

def convertIdToStr(document):
    document['_id'] = str(document['_id'])
    return document

@SIO.on('show_game_list')
def on_show_game_list(sid, name):
    players = list(GAME_DB.players.find({'name': name}))
    if len(players) > 0:
        SIO.emit('chooseNewNickname', room=sid)
    else:
        GAME_DB.players.insert_one({'name': name, 'sid': sid})
        chell = GAME_DB.chellange.find()
        chell = list(map(convertIdToStr, chell))
        SIO.emit('game_list', {'chellanges': chell, 'name': name}, room=sid)

@SIO.on('createGame')
def on_createGame(sid, data):
    GAME_DB.chellange.insert_one(data)
    chell = GAME_DB.chellange.find()
    chell = list(map(convertIdToStr, chell))
    SIO.emit('game_list', {'chellanges': chell, 'name': data['name']}, room=sid)

def createGame(chellange, name):
    game = {
        'wPlayer': name if chellange['color'] == 'black' else chellange['name'],
        'bPlayer': name if chellange['color'] == 'white' else chellange['name'],
        'time': chellange['time'],
        'inc': chellange['inc']
    }
    gameId = GAME_DB.games.insert_one(game).inserted_id
    return gameId

@SIO.on('selectGame')
def on_selectGame(sid, data):
    chellangeId = ObjectId(data['chellangeId'])
    chellange = list(GAME_DB.chellange.find({'_id': chellangeId}))
    if len(chellange) > 0:
        GAME_DB.chellange.delete_one({'_id': chellangeId})
        gameId = createGame(chellange[0], data['name'])
        game = GAME_DB.games.find({'_id': gameId})
        game = list(map(convertIdToStr, game))
        if len(game) > 0:
            game = game[0]
            playerSids = list(GAME_DB.players.find({"$or":[{"name":game['wPlayer']},
                    {"name":game['bPlayer']}]}))
            game['wSid'], game['bSid'] = ((playerSids[0]['sid'], playerSids[1]['sid'])
                    if playerSids[0]['name'] == game['wPlayer'] and playerSids[1]['name'] == game['bPlayer']
                        else (playerSids[1]['sid'], playerSids[0]['sid']))

            SIO.emit('createGame', game, room=game['wSid'])
            SIO.emit('createGame', game, room=game['bSid'])
    else:
        print('game is not aveliable')

@SIO.on('disconnect')
def on_disconnect(sid):
    q = GAME_DB.players.delete_many({'sid':sid})
    print('disconnect ' + sid + '; count: ' + str(q.deleted_count))

if __name__ == '__main__':
    APP = socketio.Middleware(SIO, APP)
    eventlet.wsgi.server(eventlet.listen((SERVER.get('host'), SERVER.get('port'))), APP)
