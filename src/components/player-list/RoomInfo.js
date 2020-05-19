import React from "react";
import { Row, Col } from "react-materialize";
import PropTypes from "prop-types";

/**
 * Component to display info required for others to join the game
 */
export class RoomInfo extends React.Component {
  static propTypes = {
    // Called when a user clicks 'leave'
    leaveRoom: PropTypes.func,
    // The url of the current room
    roomUrl: PropTypes.string,
    // The id of the current room
    roomId: PropTypes.string,
  };

  render() {
    return (
      <Row>
        <Col s={12}>
          <p>
            <b>Invite Players</b>
            <a
              style={{
                float: "right",
              }}
              href="#"
              onClick={this.props.leaveRoom}
            >
              Leave
            </a>
          </p>
          <p>{this.props.roomUrl}</p>
          <p>
            Game ID: <b>{this.props.roomId}</b>
          </p>
        </Col>
      </Row>
    );
  }
}
