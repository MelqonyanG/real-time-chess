import React from "react";
import Chess from "../../node_modules/chess.js/chess";
import ChessBoard from "chessboardjs";
import Clock from './Clock'
import Pgn from './Pgn'

class PlayGame extends React.Component {
  constructor(props) {
  super(props);
  const gameData = this.props.gameData;
  this.state = {
      time: gameData['time'],
      increase: gameData['inc'],
      side: (this.props.socket.id === gameData['wSid'] ? 'white' : 'black'),
      name: (this.props.socket.id === gameData['wSid'] ? gameData['wPlayer'] : gameData['bPlayer']),
      gameId: gameData["_id"],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      bPlayer: gameData['bPlayer'],
      wPlayer: gameData['wPlayer'],
      whiteTime: gameData['wTime'],
      blackTime: gameData['bTime'],
      moves: []
    }
    this.updateGameFen = this.updateGameFen.bind(this);

    this.props.socket.on('move', (data) =>{
      var fen = this.state.fen;
      var game = new Chess(fen);

      var move = data["move"];
      game.move(move, {sloppy: true});

      var moves = this.state.moves;
      moves.push(move);

      this.setState({
        fen: game.fen(),
        whiteTime: data["wt"],
        blackTime: data["bt"],
        moves: moves
      });
    })
  }

  getSansFromMoves(moves){
    var game = new Chess();
    var sans = [];
    for(var i=0; i<moves.length; i++ ){
      sans.push(game.move(moves[i], {sloppy: true}).san);
    }
    return [sans, game.fen()]
  }

  render() {
    var wClock = <Clock time={this.state.whiteTime} color={0}
          countDown={this.state.moves.length % 2 === 0}/>
    var bClock = <Clock time={this.state.blackTime} color={1}
          countDown={this.state.moves.length % 2 === 1}/>
      return (
        <div className="container">
          <div className='row' id="gameBoard" stlye={{padding: '20px'}}>
            <div className='col-md-6'>
              {
                this.state.side === 'black' ? wClock : bClock
              }
              <div id="chessboard" style={{"width": "80%"}}></div>
              {
                this.state.side === 'white' ? wClock : bClock
              }
            </div>
            <div className='col-md-6'>
              <Pgn moves={this.state.moves} setFen={this.updateGameFen} getSansFromMoves={this.getSansFromMoves}/>
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
    const socket = this.props.socket;
    const isDraggable = (this.state.fen === this.getSansFromMoves(this.state.moves)[1]) ? true : false;
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
      var userMove = move["from"] + move["to"];
      updateFen(game.fen(), userMove);
      var data = {
          "gameId": gameId,
          "move": userMove,
      }
      socket.emit("move", data);
    };

    var cfg = {
      draggable: isDraggable,
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

updateGameFen(currentFen, move){
  if(move){
    var moves = this.state.moves;
    moves.push(move);
    this.setState({
      moves: moves,
      fen: currentFen
    });
  }else{
    this.setState({
      fen: currentFen
    });
  }
}

componentDidUpdate(){
  this.updateComponent();
 }

 componentDidMount(){
   this.updateComponent();
 }
}

export default PlayGame;
