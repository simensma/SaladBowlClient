import React from "react";
import { Row, Col } from "react-materialize";
import { Draggable } from "react-beautiful-dnd";
import { Player } from "./Player";

/**
 * Component to display the details of a team.
 * - Displays the team name/score
 * - Displays a list of draggable players on the team
 *
 * NOTE: Must be used within a `Droppable` component
 */
class Team extends React.Component {
  render() {
    return (
      <Row>
        <Col s={12}>
          <b>{this.props.team.name}</b> - {this.props.team.score}
        </Col>
        <Col s={12}>
          {this.props.players.map((p, idx) => {
            return (
              <Draggable draggableId={p.id + ""} index={idx} key={p.id}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <Player
                      player={p}
                      currentState={this.props.currentState}
                      removePlayer={this.props.removePlayer}
                    ></Player>{" "}
                  </div>
                )}
              </Draggable>
            );
          })}
        </Col>
        {this.props.placeholder}
      </Row>
    );
  }
}

export default Team;
