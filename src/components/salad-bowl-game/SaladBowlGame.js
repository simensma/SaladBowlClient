import React from 'react';
import { Button, Row } from 'react-materialize';
import autoBind from 'react-autobind/lib/autoBind';
import PauseGameButtons from './PauseGameButtons';
import CurrentTurnHeader from './CurrentTurnHeader';
import GuessActions from './GuessActions';

/**
 * Compontent for handling gameplay
 */
class SaladBowlGame extends React.Component {
  constructor() {
    super();

    autoBind(this);
  }

  act(e, type) {
    e && e.preventDefault();

    this.props.room.send({ type });
  }


  /**
   * - Show countdown clock + ability to pause / play timer if we're inbetween rounds
   * - Show info about current round if round is playing
   *    - Countdown clock if it's not your turn
   *    - The current word + buttons to approve/decline answer if it is not your turn 
   */
  render() {
    let currentRound = this.props.round;

    if (currentRound.state === 'countdown' || currentRound.state === 'paused') {
      return <CountdownState countdown={this.props.countdown} currentRound={currentRound} act={this.act}></CountdownState>;
    } else if (currentRound.state === 'playing') {
      let currentTurn = currentRound.turns[currentRound.currentTurn] || {};
      let currentPlayer = this.props.players[currentTurn.player];
      let isYourTurn = this.props.yourId === currentTurn.player;

      return (
        <form style={{ position: 'relative' }}>
          <CurrentTurnHeader currentRound={currentRound} currentTurn={currentTurn} act={this.act}></CurrentTurnHeader>

          {currentTurn.state !== 'created' && (
            <CurrentTurnCountdown
              players={this.props.players}
              upcomingPlayer={this.props.upcomingPlayer}
              currentPlayer={this.currentPlayer}
              isYourTurn={isYourTurn}
              countdown={this.props.countdown}>
            </CurrentTurnCountdown>
          )}

          {currentTurn.state === 'created' && !isYourTurn && (
            <Row>
              <h5>Waiting for {currentPlayer.name}</h5>
            </Row>
          )}

          {currentTurn.currentWord && (<GuessActions currentTurn={currentTurn} act={this.act}></GuessActions>)}

          {currentTurn.state === 'created' && isYourTurn && <StartTurnButton act={this.act}></StartTurnButton>}
        </form>
      );
    } else {
      return (<div>{currentRound.state} State not handled</div>);
    }
  }
}


const CountdownState = ({currentRound, countdown, act}) => (
  <form>
    <h5>{currentRound.type} Round starts in</h5>
    <h2>{countdown}s {(currentRound.state == 'countdown' || currentRound.state === 'paused') && (
      <PauseGameButtons
        paused={currentRound.state === 'paused'}
        onPlay={e => act(e, 'resume')}
        onPause={e => act(e, 'pause')}>
      </PauseGameButtons>
    )}
    </h2>
  </form>
);



const CurrentTurnCountdown = ({players, upcomingPlayer, currentPlayer, countdown, isYourTurn}) =>  {
    let nextPlayer = players && players[upcomingPlayer];
    return (<Row>
      <h5>{isYourTurn ? 'YOUR' : currentPlayer.name + '\'s'} Turn ends in</h5>
      <h2>{countdown}s</h2>
      <div>{nextPlayer && <span>Next: {nextPlayer.name}</span>}</div>
    </Row>)
};

const StartTurnButton = ({act}) => (
  <Row>
    <p style={{fontSize: '24px'}}>Hit "Start Turn" when you're ready.</p>
    <Button large onClick={e => act(e, 'startTurn')}>Start Turn</Button>
  </Row>
);


export default SaladBowlGame;
