import React from "react";
import { Row } from "react-materialize";
import PauseGameButtons from "./PauseGameButtons";
import PropTypes from "prop-types";

class CurrentTurnHeader extends React.Component {
  static propTypes = {
    currentTurn: PropTypes.object,
    currentRound: PropTypes.object,
    act: PropTypes.func,
  };

  render() {
    const { currentTurn, currentRound, act } = this.props;

    return (
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            right: "5px",
            top: "0",
          }}
        >
          &nbsp;
          {(currentTurn.state === "playing" ||
            currentTurn.state === "paused") && (
            <PauseGameButtons
              paused={currentTurn.state === "paused"}
              onPlay={(e) => act(e, "resume")}
              onPause={(e) => act(e, "pause")}
            ></PauseGameButtons>
          )}
        </span>

        <Row>
          <h1
            style={{
              marginBottom: 0,
              marginTop: 0,
            }}
          >
            {currentRound.type}
          </h1>
        </Row>
      </div>
    );
  }
}

export default CurrentTurnHeader;
