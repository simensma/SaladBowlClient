import "materialize-css/dist/css/materialize.min.css";
import * as M from "materialize-css/dist/js/materialize.min";

import React, { Component } from "react";
import headerImg from "../../../public/images/salad_bowl.png";
import "../../App.css";

import * as Colyseus from "../../public/colyseus";
import RegisterForm from "components/register-form/RegisterForm";
import { Row, Col } from "react-materialize";
import NewGameForm from "components/new-game-form/NewGameForm";
import SubmitWordsForm from "components/submit-words-form/SubmitWordsForm";
import SaladBowlGame from "components/salad-bowl-game/SaladBowlGame";
import GameFinishedScreen from "components/game-finished-screen/GameFinishedScreen";
import PlayerList from "components/player-list/PlayerList";

import autoBind from "react-autobind";

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.room = null;

    this.state = {
      state: null,
      messages: [],
      numWords: 0,
      players: {},
      playerList: [],
      sessionId: null,
      gameId: this.props.gameId,
      disconnected: false,
    };

    autoBind(this);
  }

  componentDidMount() {
    this.connectToColyseus(this.serverAddr());
  }

  serverAddr() {
    if ("true" === process.env.REACT_APP_IS_DEV_ENV) {
      const host = window.document.location.host.replace(/:.*/, "");
      return (
        location.protocol.replace("http", "ws") +
        "//" +
        host +
        (location.port ? ":" + 5000 : "")
      );
    } else {
      return "wss://mighty-sands-84244.herokuapp.com";
    }
  }

  connectToColyseus(serverAddr) {
    this.client = new Colyseus.Client(serverAddr);
    this.setState({ client: this.client });

    if (this.props.gameId) {
      let session = localStorage.getItem(`session_${this.props.gameId}`);

      if (session) {
        // Try to reconnect to existing game room of you already have a saved session
        this.reconnect(this.props.gameId, session);
      }
    }
  }

  reconnect(room, session) {
    this.client.reconnect(room, session).then((room) => {
      this.setupGame(room);
    });
  }

  joinRoom(name, room) {
    let method = room
      ? this.client.joinById(room, { name, room })
      : this.client.create("game_room", { name, room });

    method.then((room) => {
      this.setupGame(room);
    });
  }

  setupGame(room) {
    this.room = room;
    this.alert = null;

    const gameUrl = `/game/${room.id}`;
    const roomUrl = `${window.document.location.host}${gameUrl}`;

    this.setState({
      sessionId: room.sessionId,
      roomUrl,
      disconnected: false,
      lastPing: null,
    });

    localStorage.setItem(`session_${room.id}`, room.sessionId);

    room.onStateChange.once((state) => {
      this.setState({ state: state.state, messages: state.messages });
    });

    room.state.players.onAdd = (player, sessionId) => {
      let players = this.state.players;
      players[sessionId] = player;
      let playerList = this.generatePlayerList(players);

      this.setState({ players, playerList });
    };

    room.state.players.onRemove = (player, sessionId) => {
      let players = this.state.players;
      delete players[sessionId];
      let playerList = this.generatePlayerList(players);

      this.setState({ players, playerList });
    };

    room.state.players.onChange = (player, sessionId) => {
      let players = this.state.players;
      players[sessionId] = player;

      let playerList = this.generatePlayerList(players);

      this.setState({ players, playerList });
    };

    room.state.onChange = (st) => {
      let updatedState = st.reduce((res, { field, value }) => {
        res[field] = value;
        return res;
      }, {});

      this.setState(updatedState);

      let playerList = this.generatePlayerList(this.state.players);

      this.setState({ playerList });
    };

    room.onLeave((code) => {
      window.M.toast({ html: "Disconnected" });
      this.setState({ disconnected: true });
    });

    room.onError((msg) => {
      console.log("Err", msg);
    });

    room.onMessage((msg) => {
      if (msg && msg.type === "ping") {
        this.setState({ lastPing: new Date() });
      }
    });

    setInterval(() => {
      if (this.state.lastPing && new Date() - this.state.lastPing > 3000) {
        if (!this.alert) {
          this.alert = window.M.toast({ html: "Disconnected" });
        }
      }
    }, 1000);
  }

  initializeRoom(room) {
    return this.room.send({ type: "init", data: room });
  }

  submitWords(words) {
    return this.room.send({ type: "submitWords", data: words });
  }

  startGame(words) {
    return this.room.send({ type: "startGame", data: words });
  }

  resume() {
    return this.room.send({ type: "resume" });
  }

  pause() {
    return this.room.send({ type: "resume" });
  }

  generatePlayerList(playersObj) {
    let players = [];

    for (let id in playersObj) {
      players.push(playersObj[id]);
    }

    return players;
  }

  gameContent() {
    return (
      <Col s={12} m={this.state.state === "created" ? 12 : 8}>
        {this.state.state === "created" && (
          <NewGameForm onSubmit={this.initializeRoom}></NewGameForm>
        )}
        {this.state.state === "initialized" && (
          <SubmitWordsForm
            players={this.state.playerList}
            numWords={this.state.numWords}
            player={this.state.players[this.state.sessionId]}
            onSubmit={this.submitWords}
            onStartSubmit={this.startGame}
          ></SubmitWordsForm>
        )}
        {this.state.state === "playing" && (
          <SaladBowlGame
            countdown={this.state.countdown}
            room={this.room}
            yourId={this.room.sessionId}
            round={this.state.rounds[this.state.currentRound]}
            upcomingPlayer={this.state.upcomingPlayer}
            players={this.state.players}
          ></SaladBowlGame>
        )}
        {this.state.state === "finished" && (
          <GameFinishedScreen
            teams={this.state.teams}
            room={this.room}
            yourId={this.room.sessionId}
            round={this.state.rounds[this.state.currentRound]}
          ></GameFinishedScreen>
        )}
      </Col>
    );
  }

  playerList() {
    return (
      <Col
        s={12}
        m={4}
        style={{
          borderLeft: "1px solid #efefef",
          height: "100%",
          boxShadow: "-2px 0px 12px -7px rgba(0,0,0,0.51)",
        }}
      >
        <PlayerList
          history={this.props.history}
          room={this.room}
          yourId={this.room.sessionId}
          teams={this.state.teams}
          currentState={this.state.state}
          roomUrl={this.state.roomUrl}
          roomId={this.room.id}
          players={this.state.playerList}
          round={this.state.rounds[this.state.currentRound]}
        ></PlayerList>
      </Col>
    );
  }

  render() {
    let isCreatedState = this.state.state === "created";
    return (
      <Row className="App">
        <Row className="App-header">
          <img src={headerImg} className="App-logo" alt="logo" />
        </Row>
        <Row className="App-content container">
          {!this.state.state && (
            <Row className="row">
              <Col s={12} m={6} offset="m3">
                <RegisterForm
                  gameId={this.state.gameId}
                  onSubmit={this.joinRoom}
                ></RegisterForm>
              </Col>
            </Row>
          )}

          {this.state.state && (
            <Row>
              {this.gameContent()}
              {!isCreatedState && this.playerList()}
            </Row>
          )}
        </Row>
      </Row>
    );
  }
}

export default MainScreen;
