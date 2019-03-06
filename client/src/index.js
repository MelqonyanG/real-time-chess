import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import * as $ from 'jquery';
import '../node_modules/chessboardjs/www/css/chessboard.css'
import './index.css'
import MainPage from "./components/MainPage"
import ChellangesList from "./components/ChellangesList"
import Game from "./components/Game"
import io from 'socket.io-client'

window.jQuery = window.$ = $;

const socket = io('http://localhost:5000')

socket.on('connect', function () {
  ReactDOM.render(<div><MainPage /></div>, document.getElementById("root"));
});

socket.on('chooseNewNickname', function(){
  ReactDOM.render(<div><MainPage msg={'choose another nickname'}/></div>, document.getElementById("root"));
});

socket.on('game_list', function(data){
  ReactDOM.render(<div><ChellangesList chellanges={data['chellanges']}
        name={data['name']}/></div>, document.getElementById("root"));
});

socket.on('createGame', function(data){
  ReactDOM.render(<div><Game data={data['chellanges']}/></div>, document.getElementById("root"));
});

export {socket};
