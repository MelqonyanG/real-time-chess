import React from "react";
import {socket} from "../index";
import ChessBoard from "chessboardjs";

class Game extends React.Component {
    render() {
        return (
          <div className="container">
            <div className='row'>
              <div className='col-md-8'>
                <div className='row'>
                  <div className='col-md-8'>
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
    componentDidMount(){
      var cfg = {
        draggable: true,
        position: 'start'
      };
      if(document.getElementById("chessboard")){
         ChessBoard('chessboard', cfg);
      }
 }

}

export default Game;
