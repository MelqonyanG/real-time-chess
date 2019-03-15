import React from "react";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    }
    this.login = this.login.bind(this);

    this.props.socket.on('confirm_user_name', (isConfirmed) =>{
      if(isConfirmed){
        this.props.set_username(this.state.username);
      }else{
        document.getElementById('msg').innerHTML = 'Select another username'
      }
    })
  }
    render() {
        return (
          <div className="container">
            <h1 style={{textAlign: 'center'}}>Choose a nickname</h1>
            <hr/>
            <span id='msg'></span>
            <input className="form-control" id='nickname' type="text" placeholder="nickname"/><br/>
            <button type="button" className="btn btn-dark" onClick={this.login}
                style={{position: 'absolute', left:'50%'}}>Login</button>
            <hr/>
          </div>
      )
    }

    login(){
      var name = document.getElementById('nickname').value;
      this.setState({username: name});
      this.props.socket.emit('login', name);
    }

}

export default LoginPage;
