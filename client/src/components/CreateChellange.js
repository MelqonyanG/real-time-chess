import React from 'react';
import {socket} from "../index";

class CreateChellange extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    'turn': "white",
    'type' : "rated",
    'time': 3,
    'inc' : 0
  };
  this.createChellange = this.createChellange.bind(this);
}

    render() {
        return (
          <div className="container">
          <h4>Minutes per side: </h4>
          <input type="number" id="time" min="0" defaultValue="3"/>
          <h4>Increment In seconds:</h4>
          <input type="number" id="inc" min="0" defaultValue="0"/>
          <br/>
          <h4>Color:</h4>
          <button type="button" className="btn btn-default" id="wturn" onClick={(trn) => this.selectTrn("white")} style={{backgroundColor: "#FFFFFF", border: "3px solid #28a745"}}>White</button>
          <button type="button" className="btn btn-default" id="bturn" onClick={(trn) => this.selectTrn("black")} style={{backgroundColor: "#000000", color:"#FFFFFF"}}>Black</button>
          <br/>
          <br/><br/><br/>
          <button type="button" className="btn btn-light" id="createGameBTN" onClick={this.createChellange}>Create Game</button>
          </div>
      )
    }
    selectTrn(trn){
      this.setState({turn: trn});
      if(trn === "white"){
        document.getElementById("bturn").style.border = "";
        document.getElementById("wturn").style.border = "3px solid #28a745";
      }
      else{
        document.getElementById("wturn").style.border = "";
        document.getElementById("bturn").style.border = "3px solid #28a745";
      }
    }

    createChellange(){
      const turn = this.state.turn;
      const time = document.getElementById("time").value;
      const inc = document.getElementById("inc").value;
      socket.emit("createChellange", {'name': this.props.name, 'time': parseInt(time) * 60, 'inc': parseInt(inc), 'color': turn})
    }
}

export default CreateChellange;
