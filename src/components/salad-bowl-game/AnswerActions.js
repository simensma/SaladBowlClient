import React from "react";
import { Button, Row, Col } from "react-materialize";
import PropTypes from "prop-types";
import styled from "styled-components";

const FirstWordSnipped = styled.p`
  font-size: 24px;
`;

const AnswerButton = styled(Button)`
  margin-bottom: "8px";
`;

class AnswerActions extends React.Component {
  static propTypes = {
    // The current turn
    currentTurn: PropTypes.object,

    // Called when an answer is approved or skipped with the given action name
    act: PropTypes.func,
  };

  render() {
    const { currentTurn, act } = this.props;

    return (
      <Row>
        <Col s={12}>
          <div className="divider"></div>

          {currentTurn.state === "created" && (
            <FirstWordSnipped>
              It's your turn! Your first word is:
            </FirstWordSnipped>
          )}

          <h1>{currentTurn.currentWord}</h1>

          {currentTurn.state !== "created" && (
            <span>
              <AnswerButton
                className="red"
                large
                waves="light"
                onClick={(e) => act(e, "skipAnswer")}
              >
                SKIP Word
              </AnswerButton>
              &nbsp;
              <AnswerButton
                large
                waves="light"
                onClick={(e) => act(e, "approveAnswer")}
              >
                Approve Guess
              </AnswerButton>
            </span>
          )}
        </Col>
      </Row>
    );
  }
}

export default AnswerActions;
