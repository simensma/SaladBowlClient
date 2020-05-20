import React, { Component } from "react";
import headerImg from "../../../public/images/salad_bowl.png";

// TODO: This should be replaced with the npm version of colyseus.js,
// however it currently breaks when imported, and needs to be investigated further.
import * as Colyseus from "../../public/colyseus";

import RegisterForm from "components/register-form/RegisterForm";
import { Row, Col } from "react-materialize";
import NewGameForm from "components/new-game-form/NewGameForm";
import SubmitWordsForm from "components/submit-words-form/SubmitWordsForm";
import SaladBowlGame from "components/salad-bowl-game/SaladBowlGame";
import GameFinishedScreen from "components/game-finished-screen/GameFinishedScreen";
import PlayerList from "components/player-list/PlayerList";

import autoBind from "react-autobind";
import { getServerAddress, roomUrl } from "services/url-service";
import styled from "styled-components";
import { handleRoomChanges } from "services/room-change-handler";

const PlayersColumn = styled(Col)`
  border-left: "1px solid #efefef",
  height: "100%",
  box-shadow: "-2px 0px 12px -7px rgba(0,0,0,0.51)",
`;

/**
 * Component that renders the main screen of the app
 * It is responsible for
 * - Determining what view to render based on the current state
 * - Connect to colyseus and listen for state changes
 * -
 */
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
    this.connectToColyseus(getServerAddress());
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

  /**
   * Join the given room. Try to join `room` if specified, otherwise create a new room of type "game_room"
   * @param {string} name Name of the room to join
   * @param {string?} room Id of the room to join (optional).
   */
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

    this.setState({
      sessionId: room.sessionId,
      roomUrl: roomUrl(room),
      disconnected: false,
      lastPing: null,
    });

    localStorage.setItem(`session_${room.id}`, room.sessionId);

    this.setupRoomHandlers(room);
    this.showAlertIfDisconnected();
  }

  /**
   * Show disconnected toast if you haven't received a ping in the last 3s
   */
  showAlertIfDisconnected() {
    setInterval(() => {
      if (this.state.lastPing && new Date() - this.state.lastPing > 3000) {
        if (!this.alert) {
          this.alert = window.M.toast({ html: "Disconnected" });
        }
      }
    }, 1000);
  }

  /**
   * Update the current state when the state of the room changes.
   * - TODO: The backend state model matches fairly well with what is used in this app, so I'm not picky about what's being set here.
   * This should probably for easier visibility and to make sure we keep the state to only what we need be done through a model layer or something similar.
   * Colyseus.io only emits events with what has changed and its new values when sending update events, so re-rendering of component trees
   * should be kept minimal.
   * @param {object} room the room to listen for changes to
   */
  setupRoomHandlers(room) {
    handleRoomChanges(
      room,
      (updatedState) => this.setState({ ...updatedState }),
      () => this.state.players
    );
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
      <PlayersColumn s={12} m={4}>
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
      </PlayersColumn>
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
