import React, { Component } from 'react';
import { Button, Row, Col } from 'react-materialize';

class SaladBowlGame extends Component {
  constructor() {
    super();
    this.approveAnswer = this.approveAnswer.bind(this);
    this.skipAnswer = this.skipAnswer.bind(this);
  }
  
  approveAnswer(e) {
    e.preventDefault();
    this.props.room.send({type: 'approveAnswer'});
  }

  skipAnswer(e) {
    e.preventDefault();
    this.props.room.send({type: 'skipAnswer'});
  }

  render() {
    let currentRound = this.props.round;
    
    if(currentRound.state === 'countdown') {
      return (
        <form>
          <h5>{currentRound.type} Round starts in</h5>
          <h2>{currentRound.countdownTime}s</h2>
        </form>
      );
    } else if(currentRound.state === 'playing') {
      let currentTurn = currentRound.turns[currentRound.currentTurn];
      let yourTurn = this.props.yourId === currentTurn.player.sessionId;

      return (
        <form>
          <Row>
            <h5>{yourTurn? 'YOUR': currentTurn.player.name + '\'s'} Turn ends in</h5>
            <h2>{currentTurn.countdownTime}s</h2>
          </Row>

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
