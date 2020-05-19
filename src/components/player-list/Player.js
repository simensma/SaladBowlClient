import React from "react";
import { Row, Icon, Col } from "react-materialize";
import styled from "styled-components";

const DoneIcon = styled.span`
  margin-right: 8px;
  color: green;
`;

const RedIcon = styled.span`
  color: red;
`;

/**
 * Component to display the details of a player
 * - Indicate If the player is ready
 * - Indicate If the player is disconnected
 * - Ability to remove the player if disconnected
 */
export class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <Col s={12}>
          {this.props.currentState === "initialized" &&
            this.props.player.ready && (
              <DoneIcon>
                <Icon tiny>done</Icon>
              </DoneIcon>
            )}

          {this.props.player.connectionStatus !== "CONNECTED" && (
            <RedIcon
              onClick={(e) => this.props.removePlayer(e, this.props.player)}
              title="Remove"
            >
              <Icon tiny right>
                clear
              </Icon>
            </RedIcon>
          )}
          {this.props.player.connectionStatus !== "CONNECTED" && (
            <RedIcon>
              <Icon tiny right>
                wifi_off
              </Icon>
            </RedIcon>
          )}
          {this.props.player.name}

          <div className="divider"></div>
        </Col>
      </Row>
    );
  }
}
