import React from "react";

class Pgn extends React.Component {
  constructor(props) {
    super(props);
    const sans = this.props.getSansFromMoves(this.props.moves)[0];
    this.state = {
      sans: sans
    }

    this.setStep = this.setStep.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const sans = this.props.getSansFromMoves(nextProps.moves)[0];
    this.setState({sans: sans})
  }

    render() {
      var pgnSan = this.state.sans;
      var num = 1;
      var uKey = 1;
      var pgnButton = [];
      for (let g = 0; g < pgnSan.length - 1; g += 2) {
        pgnButton.push(<span key = {uKey++}>
            <span onClick={(step) => this.setStep(g)}>{(num++)  + ". " +pgnSan[g]}</span>
            {'\u00A0'}
            <span onClick={(step) => this.setStep(g+1)}>{pgnSan[g+1] + " "}</span>
            </span>);
        }
        if (pgnSan.length % 2 === 1) {
          pgnButton.push(<span key = {uKey++}>
            <span onClick={(step) => this.setStep(pgnSan.length - 1)}>
              {(num++)  + ". " + pgnSan[pgnSan.length - 1]}
              </span>
            </span>)
        }

        return (
          <div id="pgnList">
            {pgnButton}
          </div>
      )
    }

    setStep(num){
      const fen = this.props.getSansFromMoves(this.props.moves.slice(0, num+1))[1];
      this.props.setFen(fen);
    }
  }

export default Pgn;
