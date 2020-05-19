import React, { Component } from "react";
import { Row, TextInput, Button, Col } from "react-materialize";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
/**
 * Component for displaying a registration form
 * - Step 1: Input an existing game ID, or hit "Create New Game"
 * - Step 2: Fill in your name
 */
class RegisterForm extends Component {
  static propTypes = {
    gameId: PropTypes.string,
  };

  static defaultProps = {
    gameId: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      room: props.gameId || null,
      newGame: false,
      selectingName: !!props.gameId,
      loading: false,
    };

    autoBind(this);
  }

  handleInputChange(e) {
    const target = e.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  joinOrCreateRoom(e) {
    e.preventDefault();

    this.props.onSubmit(this.state.name, this.state.room);
    this.setState({ loading: true });
  }

  askForName(e) {
    e.preventDefault();
    this.setState({
      selectingName: true,
      newGame: e.target.name === "new_game",
    });
  }

  render() {
    if (
      (!this.state.room && !this.state.newGame) ||
      !this.state.selectingName
    ) {
      // Step 1: Create a new game or join an existing one
      return (
        <NewGameInput
          handleInputChange={this.handleInputChange}
          askForName={this.askForName}
        ></NewGameInput>
      );
    } else {
      // Step 2: Input your name
      return (
        <NameInput
          handleInputChange={this.handleInputChange}
          loading={this.state.loading}
          joinOrCreateRoom={this.joinOrCreateRoom}
          newGame={this.state.newGame}
        ></NameInput>
      );
    }
  }
}

const NameInput = (props) => (
  <div>
    <Row>
      <h5>What's your name?</h5>
    </Row>
    <Row>
      <form className="col s12">
        <TextInput
          s={12}
          id="name"
          name="name"
          onChange={props.handleInputChange}
          placeholder="Your Name"
          label="Your Name"
        />
      </form>
    </Row>
    <Row>
      <Button
        disabled={props.loading}
        className="btn waves-effect waves-light"
        id="join_game_btn"
        onClick={props.joinOrCreateRoom}
        name="join_game"
      >
        {props.newGame ? "Create Game" : "Join Game"}
        <i className="material-icons right">send</i>
      </Button>
    </Row>
  </div>
);

const NewGameInput = (props) => (
  <Row className="section">
    <form className="col s12">
      <Row>
        <h5>Join existing game</h5>
        <Row>
          <Col s={12} className="input-field">
            <input
              name="room"
              type="text"
              onChange={props.handleInputChange}
              placeholder="Game ID"
            />
            <label htmlFor="name">Game ID</label>
          </Col>
        </Row>
        <Row className="row">
          <Col s={12}>
            <Button
              className="btn waves-effect waves-light"
              id="join_game_btn"
              onClick={props.askForName}
              name="join_game"
            >
              Join Game
              <i className="material-icons right">send</i>
            </Button>
          </Col>
        </Row>
      </Row>

      <div className="divider"></div>

      <Row className="section">
        <h5>Create new game</h5>
        <Col s={12}>
          <p>
            <button
              className="btn waves-effect waves-light"
              id="new_game_btn"
              onClick={props.askForName}
              name="new_game"
            >
              Create New Game
              <i className="material-icons right">send</i>
            </button>
          </p>
        </Col>
      </Row>
    </form>
  </Row>
);

export default RegisterForm;
