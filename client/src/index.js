import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import * as $ from 'jquery';
import '../node_modules/chessboardjs/www/css/chessboard.css'
import './index.css'
import App from "./components/App"
import io from 'socket.io-client'
import data from './clientConfig.json';

window.jQuery = window.$ = $;

const socket = io.connect(data.server.host + ':' + data.server.port);

socket.on('connect', function () {
  ReactDOM.render(<div><App socket={socket} /></div>, document.getElementById("root"));
});

// socket.on('chooseNewNickname', function(){
//   ReactDOM.render(<div><LoginPage msg={'choose another nickname'}/></div>, document.getElementById("root"));
// });
//
// socket.on('chellangeList', function(data){
//   ReactDOM.render(<div><ChellangesList chellanges={data['chellanges']}
//         name={data['name']}/></div>, document.getElementById("root"));
// });
//
// socket.on('playGame', function(data){
//   ReactDOM.render(<div><PlayGame gameData={data}/></div>,
//               document.getElementById("root"));
// });
//
// socket.on('move', function(data){
//   ReactDOM.render(<div><PlayGame move={data["move"]} wt={data["wt"]} bt={data["bt"]}/></div>,
//               document.getElementById("root"));
// });

export {socket};
