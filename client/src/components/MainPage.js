import React from "react";
import {socket} from "../index";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }
    render() {
        return (
          <div className="container">
            <h1 style={{textAlign: 'center'}}>Choose a nickname</h1>
            <hr/>
            <input className="form-control" id='nickname' type="text" placeholder="nickname"/><br/>
            {this.props.msg ? <span id='msg'>{this.props.msg}</span>:''}
            <button type="button" className="btn btn-dark" onClick={this.login}
            style={{position: 'absolute', left:'50%'}}>Login</button>
            <hr/>
          </div>
      )
    }

    login(){
      var name = document.getElementById('nickname').value;
      socket.emit('show_game_list', name);
    }

}

export default MainPage;
