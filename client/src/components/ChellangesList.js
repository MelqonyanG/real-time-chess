import React from "react";
import CreateChellange from "./CreateChellange"

class ChellangesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: this.props.username,
        chellanges: [],
        createGameMode: false
      }

      this.creatNewGame = this.creatNewGame.bind(this);
      this.selectChellange = this.selectChellange.bind(this);
      this.closeCreateGameForm = this.closeCreateGameForm.bind(this);
      this.refreshChellangeList = this.refreshChellangeList.bind(this);

      this.props.socket.on('chellangeList', (chellanges) =>{
        this.setState({chellanges: chellanges})
      })
    }

    componentDidMount(){
      this.props.socket.emit('show_chellange_list');
    }

    render() {
      let uKey = 0;
      var chellangeList = this.state.chellanges;
      var rows = chellangeList.map((game) => {
        let rowID = `row${game['_id']}`;
           return (game['name'] !== this.state.username ?
            (<li key={uKey++} id={rowID} className="list-group-item"
                        onClick={(chellangeId) => this.selectChellange(game['_id'])}>
                      <div className='row'>
                        <div className='col-md-2'>
                          <h4>{parseInt(game['time'] / 60)} + {game['inc']}</h4>
                        </div>
                        <div className='col-md-1'>
                          {game['name']}
                        </div>
                        <div className='col-md-1'>
                          {
                            game['color'] === 'b'?
                            (
                              <img src={require('./img/black.png')} alt='black'/>
                            ):(
                              <img src={require('./img/white.png')} alt='white'/>
                            )
                          }
                        </div>
                      </div>
                    </li>) :
            (<li key={uKey++} id={rowID} className="list-group-item" style={{backgroundColor: '#E5DFDE'}}>
                    <div className='row'>
                      <div className='col-md-2'>
                        <h4>{parseInt(game['time'] / 60)} + {game['inc']}</h4>
                      </div>
                      <div className='col-md-1'>
                        {game['name']}
                      </div>
                      <div className='col-md-1'>
                        {
                          game['color'] === 'b'?
                            (
                              <img src={require('./img/black.png')} alt='black'/>
                            ):(
                              <img src={require('./img/white.png')} alt='white'/>
                            )
                          }
                      </div>
                    </div>
                </li>))
    });

        return (
          <div className="container">
            {
              this.state.createGameMode ? (
                <CreateChellange name={this.state.username} socket={this.props.socket}
                    closeCreateGameForm={this.closeCreateGameForm}/>
              ):
              <div>
                <hr/>
                <img src={require('./img/refresh.png')} alt='refresh'
                    style={{width:'7%', height:'7%'}} onClick={this.refreshChellangeList}/>
                <div>
                  <ul className="list-group list-group-flush">
                    {rows}
                  </ul>
                  <hr/>
                  <button type="button" className="btn btn-light" onClick={this.creatNewGame}>
                      {'Create new chellange'}
                  </button>
                </div>
              </div>
            }
          </div>
      )
    }

    selectChellange(chellangeId){
      this.props.socket.emit('selectChellange', {'name': this.state.username, 'chellangeId': chellangeId})
    }

    creatNewGame(){
      this.setState({createGameMode: true});
    }

    closeCreateGameForm(){
      this.setState({createGameMode: false});
      this.props.socket.emit('show_chellange_list');
    }

    refreshChellangeList(){
      this.props.socket.emit('show_chellange_list');
    }
}

export default ChellangesList;
