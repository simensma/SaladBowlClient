import React from "react";
import { Row } from "react-materialize";
import PauseGameButtons from "./PauseGameButtons";
import PropTypes from "prop-types";
import styled from "styled-components";

const HeaderButtons = styled.span`
  position: absolute;
  right: 5px;
  top: 0;
`;

const HeaderTitle = styled.h1`
  margin-bottom: 0;
  margin-top: 0;
`;

const Header = styled.div`
  position: relative;
`;

/**
 * Component for displaying info about the current turn,
 * and buttons for pausing/resuming the game timer
 */
class CurrentTurnHeader extends React.Component {
  static propTypes = {
    currentTurn: PropTypes.object,
    currentRound: PropTypes.object,

    // Performs an action with the given name
    act: PropTypes.func,
  };

  render() {
    const { currentTurn, currentRound, act } = this.props;

    return (
      <Header>
        <HeaderButtons>
          &nbsp;
          {(currentTurn.state === "playing" ||
            currentTurn.state === "paused") && (
            <PauseGameButtons
              paused={currentTurn.state === "paused"}
              onPlay={(e) => act(e, "resume")}
              onPause={(e) => act(e, "pause")}
            ></PauseGameButtons>
          )}
        </HeaderButtons>

        <Row>
          <HeaderTitle>{currentRound.type}</HeaderTitle>
        </Row>
      </Header>
    );
  }
}

export default CurrentTurnHeader;
