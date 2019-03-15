import React from "react";
import LoginPage from './LoginPage'
import ChellangesList from './ChellangesList'
import PlayGame from './PlayGame';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      game: {}
    }

    this.set_username = this.set_username.bind(this);

    this.props.socket.on('playGame', (data) =>{
      this.setState({game: data})
    })
  }

  set_username(name){
    this.setState({username: name})
  }

    render() {
        return (
          <div className="container">
            {
              this.state.username === '' ? (
                <LoginPage socket={this.props.socket} set_username={this.set_username}/>
              ): (
                Object.keys(this.state.game).length === 0 ? (
                  <ChellangesList username={this.state.username} socket={this.props.socket} />
                ):(
                  <PlayGame gameData={this.state.game} socket={this.props.socket}/>
                )
              )
            }
          </div>
      )
    }

}

export default App;
