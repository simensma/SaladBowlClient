import React, { Component } from 'react';
import { Button, Row, Col, Icon } from 'react-materialize';

class SaladBowlGame extends Component {
  constructor() {
    super();
    this.approveAnswer = this.approveAnswer.bind(this);
    this.skipAnswer = this.skipAnswer.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.startTurn = this.startTurn.bind(this);
  }
  
  approveAnswer(e) {
    e.preventDefault();
    this.props.room.send({type: 'approveAnswer'});
  }

  skipAnswer(e) {
    e.preventDefault();
    this.props.room.send({type: 'skipAnswer'});
  }

  startTurn(e) {
    e.preventDefault();
    this.props.room.send({type: 'startTurn'});
  }

  pause(e) {
    e.preventDefault();
    this.props.room.send({type: 'pause'});
  }

  resume(e) {
    e.preventDefault();
    this.props.room.send({type: 'resume'});
  }

  render() {
    let currentRound = this.props.round;
    if(currentRound.state === 'countdown' || currentRound.state === 'paused') {
      return (
        <form>
          <h5>{currentRound.type} Round starts in</h5>
          <h2>{this.props.countdown}s {currentRound.state == 'countdown' && (
              <Button small waves="light" onClick={this.pause}><Icon>pause</Icon></Button>)}
              {currentRound.state == 'paused' && (
              <Button small waves="light" onClick={this.resume}><Icon>play_arrow</Icon></Button>)}
          </h2>
        </form>
      );
    } else if(currentRound.state === 'playing') {
      let currentTurn = currentRound.turns[currentRound.currentTurn] || {};
      let yourTurn = this.props.yourId === currentTurn.player.sessionId;
      let nm = this.props.players && this.props.players[this.props.upcomingPlayer];

      return (
        <form style={{position: 'relative'}}>
          <span style={{position: 'absolute', right: '5px', top: '0'}}>
            &nbsp;
            {currentTurn.state == 'playing' && (
            <Button small waves="light" onClick={this.pause}><Icon>pause</Icon></Button>)}
            {currentTurn.state == 'paused' && (
            <Button small waves="light" onClick={this.resume}><Icon>play_arrow</Icon></Button>)}
          </span>
  
          <Row>
            <h1 style={{marginBottom: 0, marginTop: 0}}>{currentRound.type}</h1>
          </Row>

          {currentTurn.state !== 'created' && (
            <Row>
              <h5>{yourTurn? 'YOUR': currentTurn.player.name + '\'s'} Turn ends in</h5>
              <h2>{this.props.countdown}s</h2>
              <div>{nm && (<span>Next: {nm.name}</span>)}</div>
            </Row>
          )}

          {currentTurn.state === 'created' && yourTurn && (
            <Row>
              <p>It's your turn! Hit "Start Turn" when you're ready.</p>
              <Button large onClick={this.startTurn}>Start Turn</Button>
            </Row>
          )}

          {currentTurn.state === 'created' && !yourTurn && (
            <Row>
              <h5>Waiting for {currentTurn.player.name}</h5>
            </Row>
          )}

          {currentTurn.currentWord &&
            <Row>
              <Col s={12}>
                <div className="divider"></div>
                <h1>{currentTurn.currentWord}</h1>

                <Button className="red" large waves="light" onClick={this.skipAnswer}>SKIP Word</Button>&nbsp;
                <Button large waves="light" onClick={this.approveAnswer}>Approve Guess</Button>
              </Col>
            </Row>
          }
        </form>
      );
    } else {
      return (<div>{currentRound.state} State not handled</div>);
    }
  }
}

export default SaladBowlGame;
