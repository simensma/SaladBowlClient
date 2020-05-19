import React, { Component } from "react";
import { Select, Button, Row, Col, Icon } from "react-materialize";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import RoundEditor from "./RoundInput";

// Prepopulated rounds
const DEFAULT_ROUNDS = [
  { type: "Taboo", duration: 60 },
  { type: "Charades", duration: 45 },
  { type: "One Word", duration: 30 },
];

// Default number of words submitted per person
const DEFAULT_NUM_WORDS = 3;

// Max number of words submitted per person
const MAX_NUM_WORDS = 20;

/**
 * Component for showing a form to create a new game
 */
class NewGameForm extends Component {
  static propTypes = {
    // Called with `this.state` when form is submitted
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      numWords: DEFAULT_NUM_WORDS,
      rounds: [...DEFAULT_ROUNDS],
      saving: false,
      loading: false,
    };

    autoBind(this);
  }

  createGame(e) {
    e.preventDefault();

    this.props.onSubmit(this.state);
  }

  /**
   * Removes round at the given index
   * @param {number} idx index of round to remove
   */
  removeRound(idx) {
    let rounds = this.state.rounds;
    rounds.splice(idx, 1);

    this.setState({ rounds });
  }

  /**
   * Adds a new Taboo round to the game.
   * @param {Event} e dom event that triggered this
   */
  addRound(e) {
    e.preventDefault();

    let rounds = this.state.rounds;
    rounds.push({ type: "Taboo", duration: 60 });

    this.setState({ rounds });
  }

  /**
   * Sets state[e.target.name] to e.target.value
   */
  propUpdated(e) {
    const target = e.target;
    this.setState({
      [target.name]: parseInt(target.value, 10),
    });
  }

  roundUpdated(idx, prop, val) {
    let rounds = this.state.rounds;
    rounds[idx][prop] = val;

    this.setState({ rounds });
  }

  render() {
    const numWordsSelection = [...Array(MAX_NUM_WORDS).keys()];

    return (
      <Row>
        <form
          className="col s12 m8 offset-m2 l6 offset-l3"
          onSubmit={this.createGame}
        >
          <Row>
            <h5>New Game</h5>
          </Row>
          <Row>
            <Col s={12} m={6} offset="m3">
              <Select
                label="Number of words per person"
                name="numWords"
                defaultValue={this.state.numWords}
                onChange={this.propUpdated}
              >
                <option value="" disabled>
                  Choose your option
                </option>
                {numWordsSelection.map((value, idx) => (
                  <option key={idx} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col s={12}>
              <h6>Rounds</h6>
            </Col>

            {this.state.rounds.map((round, idx) => (
              <div key={idx}>
                <RoundEditor
                  name={`Round ${idx + 1}`}
                  type={round.type}
                  duration={round.duration}
                  onUpdate={this.roundUpdated.bind(null, idx)}
                  onRemove={this.removeRound.bind(null, idx)}
                ></RoundEditor>
                {idx < this.state.rounds.length - 1 && (
                  <Col s={12}>
                    <div className="divider"></div>
                  </Col>
                )}
              </div>
            ))}
          </Row>
          <Row>
            <Col s={12} style={{ textAlign: "right" }}>
              <Button
                className="btn-small waves-effect waves-light"
                onClick={this.addRound}
              >
                Add Round <Icon right>add</Icon>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col s={12} className="divider"></Col>
          </Row>
          <Row>
            <Button
              disabled={this.state.loading}
              className="btn-large waves-effect waves-light"
              type="submit"
            >
              Start Game <Icon right>send</Icon>
            </Button>
          </Row>
        </form>
      </Row>
    );
  }
}

export default NewGameForm;
