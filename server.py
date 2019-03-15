from flask import Flask
import socketio
import eventlet
import json
from pymongo import MongoClient
from bson import ObjectId
from utils import response_json
from datetime import datetime

with open('server_config.json') as json_data_file:
    data_server = json.load(json_data_file)

SERVER = data_server.get('server')

APP = Flask(__name__)
SIO = socketio.Server()
MONGO_CLIENT = MongoClient('localhost', 27017)
GAME_DB = MONGO_CLIENT.games

@SIO.on('connect')
def on_connect(sid, data):
    print('user connected ' + sid)

def convertIdToStr(document):
    document['_id'] = str(document['_id'])
    return document

def send_chellange_list(sid):
    chellanges = GAME_DB.chellange.find()
    chellanges = list(map(convertIdToStr, chellanges))
    SIO.emit('chellangeList', chellanges, room=sid)

@SIO.on('login')
def on_login(sid, name):
    players_count_with_name = GAME_DB.players.find({'name': name}).count()
    if players_count_with_name > 0:
        SIO.emit('confirm_user_name', False, room=sid)
    else:
        SIO.emit('confirm_user_name', True, room=sid)
        GAME_DB.players.insert_one({'name': name, 'sid': sid})

@SIO.on('show_chellange_list')
def on_show_chellange_list(sid):
    send_chellange_list(sid)

@SIO.on('createChellange')
def on_createChellange(sid, data):
    data['sid'] = sid
    GAME_DB.chellange.insert_one(data)

def createGame(chellange, name):
    game = {
        'wPlayer': name if chellange['color'] == 'black' else chellange['name'],
        'bPlayer': name if chellange['color'] == 'white' else chellange['name'],
        'time': chellange['time'],
        'inc': chellange['inc'],
        'wTime': chellange['time'],
        'bTime': chellange['time'],
        'moves': [],
        'start_time': str(datetime.utcnow()),
        'last_move_time': str(datetime.utcnow())
    }

    playerSids = list(GAME_DB.players.find({"$or":[{"name":game['wPlayer']}, {"name":game['bPlayer']}]}))
    game['wSid'], game['bSid'] = (
            (playerSids[0]['sid'], playerSids[1]['sid'])
        if playerSids[0]['name'] == game['wPlayer'] and playerSids[1]['name'] == game['bPlayer']
            else (playerSids[1]['sid'], playerSids[0]['sid']))

    gid = GAME_DB.games.insert_one(game).inserted_id
    game['_id'] = str(game['_id'])
    return game

@SIO.on('selectChellange')
def on_selectGame(sid, data):
    chellangeId = ObjectId(data['chellangeId'])
    chellange = list(GAME_DB.chellange.find({'_id': chellangeId}))
    if len(chellange) > 0:
        GAME_DB.chellange.delete_one({'_id': chellangeId})
        game = createGame(chellange[0], data['name'])
        SIO.emit('playGame', game, room=game['wSid'])
        SIO.emit('playGame', game, room=game['bSid'])
    else:
        print('game is not aveliable')

def updatePlayersTime(game_id, turn):
    cur = datetime.utcnow()
    game = GAME_DB.games.find_one({'_id': game_id})
    last_move_time = datetime.strptime(game['last_move_time'], '%Y-%m-%d %H:%M:%S.%f')
    difference = (cur - last_move_time).total_seconds()
    if turn == 'w':
        time = round((game['wTime'] - difference + game['inc']))
        GAME_DB.games.update_one({'_id': game_id}, {"$set": { "wTime": time }})
        wT, bT = time, game['bTime']
    else:
        time = round((game['bTime'] - difference + game['inc']))
        GAME_DB.games.update_one({'_id': game_id}, {"$set": { "bTime": time }})
        wT, bT = game['wTime'], time
    GAME_DB.games.update_one({'_id': game_id}, {"$set": { "last_move_time": str(cur) }})
    return wT, bT

def update_pgn(game_id, move):
    data = GAME_DB.games.find_one({'_id': game_id}, {'moves': 1})
    data['moves'].append(move)
    GAME_DB.games.update_one({'_id': game_id}, {"$set": { "moves": data['moves'] }})
    return True

@SIO.on('move')
def on_move(sid, data):
    game_id = ObjectId(data.get("gameId"))
    move = data.get("move")
    game = GAME_DB.games.find_one({'_id': game_id})
    if not game:
        print("Game not found.")
        return response_json(404, "Game not found.")

    turn = 'w' if len(game['moves'])%2 == 0 else 'b'
    if turn == 'w' and sid != game['wSid'] or turn == 'b' and sid != game['bSid']:
        print("Not your move.")
        return response_json(400, "Not your move.")

    wT, bT = updatePlayersTime(game_id, turn)
    moveIsLegal = update_pgn(game_id, move)
    if not moveIsLegal: return response_json(400, "Illegal move.")

    game_data = {
        "move": move,
        "wt": wT,
        "bt": bT
    }
    if turn == 'w':
        SIO.emit('move', game_data, room=game['bSid'])
    else:
        SIO.emit('move', game_data, room=game['wSid'])

@SIO.on('disconnect')
def on_disconnect(sid):
    q1 = GAME_DB.players.delete_many({'sid':sid})
    print('disconnect ' + sid + '; count: ' + str(q1.deleted_count))

    q2 = GAME_DB.games.delete_many({"$or":[{"wSid":sid}, {'bSid': sid}]})
    print('delete games ' + str(q2.deleted_count))

    q3 = GAME_DB.chellange.delete_many({'sid': sid})
    print('delete chellanges ' + str(q3.deleted_count))

if __name__ == '__main__':
    APP = socketio.Middleware(SIO, APP)
    eventlet.wsgi.server(eventlet.listen((SERVER.get('host'), SERVER.get('port'))), APP)
