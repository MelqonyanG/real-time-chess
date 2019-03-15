import React from "react";

const COLORS = ['white', 'black'];

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seconds: this.props.time,
      time: this.secondsToTime(this.props.time),
      countDown: this.props.countDown
    };

    this.countDownClock = this.countDownClock.bind(this);
    this.timer = this.props.countDown ? setInterval(this.countDownClock, 1000) : 0;
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.time);
    clearInterval(this.timer)
    if(nextProps.countDown){
      this.timer = setInterval(this.countDownClock, 1000);
    }else{
      clearInterval(this.timer);
    }
    this.setState({
      seconds: nextProps.time,
      time: this.secondsToTime(nextProps.time),
      countDown: nextProps.countDown
    })
  }

  secondsToTime(secs){
    let minutes = Math.floor(secs / 60);
    let divisor_for_seconds = secs % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    if(seconds < 10){
      seconds  = "0" + seconds;
    }
    let obj = {
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  countDownClock() {
      let seconds = this.state.seconds - 1;
      if(seconds >= 0){
        this.setState({
          time: this.secondsToTime(seconds),
          seconds: seconds,
        });
      }
      if (seconds <= 0) {
        clearInterval(this.timer);
      }
    }

    render() {
      const color = this.props.color;
      const time = this.state.time;

        return (
          <div id='clock' style={{backgroundColor:COLORS[color], color:COLORS[1-color]}}>
            {time.m} : {time.s}
          </div>
      )
    }


}

export default Clock;
