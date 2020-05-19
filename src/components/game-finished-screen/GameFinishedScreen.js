import React from "react";
import PropTypes from "prop-types";
import { Row } from "react-materialize";

/**
 * Component for when the game is finished.
 *  - Displays a list of all teams and their associated score
 */
class GameFinishedScreen extends React.Component {
  static propTypes = {
    // Array of teams ({name, score})
    teams: PropTypes.array,
  };

  render() {
    return (
      <Row>
        <h1>Game Finished!!</h1>

        {this.props.teams.map((team) => {
          return (
            <Row key={team.name}>
              {team.name}: {team.score} points
            </Row>
          );
        })}
      </Row>
    );
  }
}

export default GameFinishedScreen;
