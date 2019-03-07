import React from "react";
import {socket} from "../index";
import Chess from "../../node_modules/chess.js/chess";
import ChessBoard from "chessboardjs";

class PlayGame extends React.Component {
  constructor(props) {
  super(props);
  const gameData = this.props.gameData;
  this.state = {
    time: gameData['time'],
    increase: gameData['inc'],
    side: (socket.id === gameData['wSid'] ? 'white' : 'black'),
    name: (socket.id === gameData['wSid'] ? gameData['wPlayer'] : gameData['bPlayer']),
    gameId: gameData["_id"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    bPlayer: gameData['bPlayer'],
    wPlayer: gameData['wPlayer'],
    whiteTime: gameData['wTime'],
    blackTime: gameData['bTime']
    }
    this.updateGameFen = this.updateGameFen.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps["move"]){
      var fen = this.state.fen;
      var move = nextProps["move"];
      var game = new Chess(fen);
      game.move(move, {sloppy: true});
      this.setState({
        fen: game.fen(),
        whiteTime: nextProps["wt"],
        blackTime: nextProps["bt"]
      });
    }
  }

  render() {
      return (
        <div className="container">
          <div className='row'>
            <div className='col-md-8'>
              <div className='row'>
                <div className='col-md-8'>
                    <h3>White Player: {this.state.whitePlayerId}  Time: {this.state.whiteTime}</h3>
                    <h3>Black Player: {this.state.blackPlayerId}  Time: {this.state.blackTime}</h3>
                    <div id="chessboard" style={{"width": "100%"}}></div>
                </div>
                <div className='col-md-4'>
                  pgn
                </div>
              </div>
              <div className='row'>
                another games
              </div>
            </div>
            <div className='col-md-4'>
              chellange List
            </div>
          </div>
        </div>
    )
  }

  updateComponent(){
    var fen = this.state.fen;
    const gameId = this.state.gameId;
    var updateFen = this.updateGameFen;
    const userTurn = this.state.side;
    var board,
    move,
    game = new Chess(fen);

    var onDragStart = function(source, piece, position, orientation) {
      if(userTurn.charAt(0) === 'w'){
        if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
          return false;
        }
      }else{
        if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^w/) !== -1) {
        return false;
        }
      }
    };

    var onDrop = function(source, target) {
      move = game.move({
      from: source,
      to: target,
      promotion: 'q'
      });

      if (move === null) return 'snapback';
    };

    if(game.game_over()){
      this.gameOver(game);
    }

    var onSnapEnd = function() {
      board.position(game.fen());
      updateFen(game.fen());
      var userMove = move["from"] + move["to"];
      var data = {
          "gameId": gameId,
          "move": userMove,
      }
      socket.emit("move", data);
    };

    var cfg = {
      draggable: true,
      orientation: userTurn,
      position:fen,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    };
    if(document.getElementById("chessboard")){
      board = ChessBoard('chessboard', cfg);
    }
}

gameOver(game){
  console.log("Game Is over in front");
  console.log(game);
}

updateGameFen(currentFen){
  this.setState({
    fen: currentFen
  });
}

componentDidUpdate(){
  this.updateComponent();
 }

 componentDidMount(){
   this.updateComponent();
 }
}

export default PlayGame;
