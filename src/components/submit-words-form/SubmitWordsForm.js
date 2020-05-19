import React from "react";
import { Col, Row, TextInput } from "react-materialize";
import autoBind from "react-autobind/lib/autoBind";
import PropTypes from "prop-types";

/**
 * Component for submitting your words, and starting the game when everyone has submitted
 */
class SubmitWordsForm extends React.Component {
  static propTypes = {
    // List of current players, including yourself
    players: PropTypes.array,
    // Called when you submit your words
    onSubmit: PropTypes.func,
    // Called when you hit "Start Game" after all players are ready
    onStartSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      words: new Array(props.numWords).fill(""),
      loading: false,
    };

    autoBind(this);
  }

  wordUpdated(e, idx) {
    let words = this.state.words;
    words[idx] = e.target.value;

    this.setState({ words });
  }

  submitWords(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  startGame(e) {
    e.preventDefault();
    this.props.onStartSubmit();
  }

  /**
   * View when you have submitted your words.
   * Allows everyone to start the game when all players have submitted their words.
   */
  submittedFormOutput() {
    const notReady = this.props.players.some((p) => !p.ready);

    return (
      <Row>
        <form className="col s12" onSubmit={this.startGame}>
          <Row>
            <h4>
              {notReady
                ? "Waiting for everyone to submit words"
                : "Waiting for game to start"}
            </h4>
          </Row>

          <Row>
            <input
              type="submit"
              disabled={notReady}
              className="btn-large waves-effect waves-light"
              value="Start game"
            ></input>
          </Row>
        </form>
      </Row>
    );
  }

  /**
   * View when you haven't submitted your words yet.
   */
  submitFormOutput() {
    return (
      <Row>
        <form className="col s12 m8 offset-m2" onSubmit={this.submitWords}>
          <Row>
            <Col s={12}>
              <h5>Submit your words</h5>
            </Col>
          </Row>

          {this.state.words.map((val, idx) => {
            return (
              <Row key={idx}>
                <TextInput
                  data-length={150}
                  s={12}
                  label={"Word " + (idx + 1)}
                  onChange={(e) => this.wordUpdated(e, idx)}
                ></TextInput>
              </Row>
            );
          })}

          <Row>
            <input
              disabled={this.state.loading}
              className="btn-large waves-effect waves-light"
              type="submit"
              value="Submit"
            ></input>
          </Row>
        </form>
      </Row>
    );
  }

  render() {
    if (this.props.player.ready) {
      return this.submittedFormOutput();
    } else {
      return this.submitFormOutput();
    }
  }
}

export default SubmitWordsForm;
