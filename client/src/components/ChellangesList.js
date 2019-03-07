import React from "react";
import ReactDOM from 'react-dom'
import {socket} from "../index";
import CreateChellange from "./CreateChellange"

class ChellangesList extends React.Component {
    constructor(props) {
      super(props);
      this.creatNewGame = this.creatNewGame.bind(this);
      this.selectChellange = this.selectChellange.bind(this);
    }
    render() {
      let uKey = 0;
      var chellangeList = this.props.chellanges;
      var rows = chellangeList.map((game) => {
        let rowID = `row${game['_id']}`;
           return (game['name'] !== this.props.name ?
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
            <hr/>
            <ul className="list-group list-group-flush">
              {rows}
            </ul>
            <hr/>
            <button type="button" className="btn btn-light" onClick={this.creatNewGame}>{'Create new chellange'}</button>
          </div>
      )
    }

    selectChellange(chellangeId){
      socket.emit('selectChellange', {'name': this.props.name, 'chellangeId': chellangeId})
    }

    creatNewGame(){
      ReactDOM.render(<div><CreateChellange name={this.props.name}/></div>, document.getElementById("root"));
    }
}

export default ChellangesList;
