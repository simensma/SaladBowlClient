import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

import React, { Component } from 'react';
import headerImg from '../../../public/images/salad_bowl.png';
import '../../App.css';

import * as Colyseus from "../../public/colyseus";
import RegisterForm from 'components/register-form/RegisterForm';
import { Row } from 'react-materialize';
import NewGameForm from 'components/new-game-form/NewGameForm';
import SubmitWordsForm from 'components/submit-words-form/SubmitWordsForm';
import SaladBowlGame from 'components/salad-bowl-game/SaladBowlGame';
import GameFinishedScreen from 'components/game-finished-screen/GameFinishedScreen';
import PlayerList from 'components/player-list/PlayerList';

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.room = null;
    this.joinRoom = this.joinRoom.bind(this);
    this.initializeRoom = this.initializeRoom.bind(this);
    this.submitWords = this.submitWords.bind(this);
    this.startGame = this.startGame.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.setupGame = this.setupGame.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.generatePlayerList = this.generatePlayerList.bind(this);

    this.state = {
      state: null,
      messages: [],
      numWords: 0,
      players: {},
      playerList: [],
      sessionId: null,
      gameId: this.props.gameId,
    };
  }

  componentDidMount() {    
    let serverAddr = null;

    // if('development' === process.env.NODE_ENV) {
    //   const host = window.document.location.host.replace(/:.*/, '');
    //   serverAddr = location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':'+2567 : '');
    // } else {
      serverAddr = 'ws://mighty-sands-84244.herokuapp.com';
    // }
    
    this.client = new Colyseus.Client(serverAddr);

    if(this.props.gameId) {
      let session = localStorage.getItem(`session_${this.props.gameId}`);

      if(session) {
        this.reconnect(this.props.gameId, session);
      }
    }
  }

  reconnect(room, session) {
    this.client.reconnect(room, session).then(room => {
      this.setupGame(room);
    });
  }

  joinRoom(name, room) {
    let method = room? this.client.joinById(room, {name, room}):
        this.client.create('game_room', {name, room});

    method.then(room => {
      this.setupGame(room);
    });
  }

  setupGame(room) {
    this.room = room;

    const gameUrl = `/game/${room.id}`;
    const roomUrl = `${window.document.location.host}${gameUrl}`;
    
    this.setState({sessionId: room.sessionId, roomUrl});

    localStorage.setItem(`session_${room.id}`, room.sessionId);

    room.onStateChange.once(state => {
        this.setState({state: state.state, messages: state.messages});
    });

    room.state.players.onAdd = (player, sessionId) => {
      let players = this.state.players;
      players[sessionId] = player;
      let playerList = this.generatePlayerList(players);

      this.setState({players, playerList});
    }

    room.state.players.onRemove = (player, sessionId) => {
      let players = this.state.players;
      delete players[sessionId];
      let playerList = this.generatePlayerList(players);

      this.setState({players, playerList});
    }

    room.state.players.onChange = (player, sessionId) => {
      console.log(player.team.score);
      let players = this.state.players;
      players[sessionId] = player;

      let playerList = this.generatePlayerList(players);

      this.setState({players, playerList});
    }

    room.state.onChange = st => {
      let updatedState = st.reduce((res, ch) => {
        res[ch.field] = ch.value;
        return res;
      }, {});

      this.setState(updatedState);

      let playerList = this.generatePlayerList(this.state.players);

      this.setState({playerList});
    };
  }

  initializeRoom(room) {
    this.room.send({type: 'init', data: room});
  }

  submitWords(words) {
    this.room.send({type: 'submitWords', data: words});
  }
  
  startGame(words) {
    this.room.send({type: 'startGame', data: words});
  }

  resume() {
    this.room.send({type: 'resume'});
  }

  pause() {
    this.room.send({type: 'resume'});
  }

  generatePlayerList(playersObj) {
    let players = [];

    for(let id in playersObj) {
      players.push(playersObj[id]);
    }

    return players;
  }
  
  render() {
    let isCreatedState = this.state.state === 'created';
    return (
      <div className="App">
        <div className="App-header">
          <img src={headerImg} className="App-logo" alt="logo" />
        </div>
        <div className="App-content container">
          {!this.state.state && <div className="row">
            <div className="col s12 m6 offset-m3">
              <RegisterForm gameId={this.state.gameId} onSubmit={this.joinRoom}></RegisterForm>
            </div>
          </div>}

          {this.state.state &&<div className="row">
            <div className={this.state.state === 'created'? 'col s12': 'col s12 m8'}>
              {this.state.state === 'created' && <NewGameForm onSubmit={this.initializeRoom}></NewGameForm>}
              {this.state.state === 'initialized' && <SubmitWordsForm players={this.state.playerList} numWords={this.state.numWords} player={this.state.players[this.state.sessionId]} onSubmit={this.submitWords} onStartSubmit={this.startGame}></SubmitWordsForm>}
              {this.state.state === 'playing' && <SaladBowlGame room={this.room} yourId={this.room.sessionId} round={this.state.rounds[this.state.currentRound]}></SaladBowlGame>}
              {this.state.state === 'finished' && <GameFinishedScreen room={this.room} yourId={this.room.sessionId} round={this.state.rounds[this.state.currentRound]}></GameFinishedScreen>}
            </div>
            {!isCreatedState &&
            <div className="col s12 m4" style={{borderLeft: '1px solid #efefef', height: '100%', boxShadow: '-2px 0px 12px -7px rgba(0,0,0,0.51)'}}>
              <PlayerList currentState={this.state.state} roomUrl={this.state.roomUrl} roomId={this.room.id} players={this.state.playerList} round={this.state.rounds[this.state.currentRound]}></PlayerList>
            </div>
            }
          </div>}
        </div>
      </div>
    );
  }
}

export default MainScreen;
