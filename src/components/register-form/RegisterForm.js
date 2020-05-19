import React, { Component } from "react";
import { Row, TextInput, Button } from "react-materialize";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.joinOrCreateRoom = this.joinOrCreateRoom.bind(this);
    this.askForName = this.askForName.bind(this);
    this.state = {
      name: null,
      room: props.gameId || null,
      newGame: false,
      selectingName: !!props.gameId,
      loading: false,
    };
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
    if ((this.state.room || this.state.newGame) && this.state.selectingName) {
      return (
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
                onChange={this.handleInputChange}
                placeholder="Your Name"
                label="Your Name"
              />
            </form>
          </Row>
          <Row>
            <Button
              disabled={this.state.loading}
              className="btn waves-effect waves-light"
              id="join_game_btn"
              onClick={this.joinOrCreateRoom}
              name="join_game"
            >
              {this.state.newGame ? "Create Game" : "Join Game"}
              <i className="material-icons right">send</i>
            </Button>
          </Row>
        </div>
      );
    }

    return (
      <div className="row section">
        <form className="col s12">
          <div>
            <h5>Join existing game</h5>
            <div className="row">
              <div className="input-field col s12">
                <input
                  name="room"
                  type="text"
                  onChange={this.handleInputChange}
                  placeholder="Game ID"
                />
                <label htmlFor="name">Game ID</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <button
                  className="btn waves-effect waves-light"
                  id="join_game_btn"
                  onClick={this.askForName}
                  name="join_game"
                >
                  Join Game
                  <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="row section">
            <h5>Create new game</h5>
            <div className="col s12">
              <p>
                <button
                  className="btn waves-effect waves-light"
                  id="new_game_btn"
                  onClick={this.askForName}
                  name="new_game"
                >
                  Create New Game
                  <i className="material-icons right">send</i>
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
