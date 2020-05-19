import React from "react";
import { Button, Row, Col } from "react-materialize";
import PropTypes from "prop-types";

class GuessActions extends React.Component {
  static propTypes = {
    currentTurn: PropTypes.object,
    act: PropTypes.func,
  };

  render() {
    const { currentTurn, act } = this.props;

    return (
      <Row>
        <Col s={12}>
          <div className="divider"></div>

          {currentTurn.state === "created" && (
            <p
              style={{
                fontSize: "24px",
              }}
            >
              It's your turn! Your first word is:
            </p>
          )}

          <h1>{currentTurn.currentWord}</h1>

          {currentTurn.state !== "created" && (
            <span>
              <Button
                style={{
                  marginBottom: "8px",
                }}
                className="red"
                large
                waves="light"
                onClick={(e) => act(e, "skipAnswer")}
              >
                SKIP Word
              </Button>
              &nbsp;
              <Button
                style={{
                  marginBottom: "8px",
                }}
                large
                waves="light"
                onClick={(e) => act(e, "approveAnswer")}
              >
                Approve Guess
              </Button>
            </span>
          )}
        </Col>
      </Row>
    );
  }
}

export default GuessActions;
