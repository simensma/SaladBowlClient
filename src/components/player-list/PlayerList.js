import React, { Component } from "react";
import { Row, Col } from "react-materialize";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import autoBind from "react-autobind";
import Team from "./Team";
import { RoomInfo } from "./RoomInfo";

/**
 * Component to display a list of all players in the game grouped by the team they are on
 * and player/team management functionality
 * - Show connection status of a player
 * - Ability to remove player from game
 * - Ability re-order and move players between teams using `react-beautiful-dnd`
 * - Ability to leave game
 */
class PlayerList extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  /**
   * Reorder players when drag ends
   * @param {Object} destination droppableId: id of the droppable (in this case id of the team) where the item was dropped, index: position in the team
   * @param {Object} source droppableId: id of the droppable (in this case id of the team) of the item before dragging, index: position in the team before dragging
   * @param {string} source draggableId: id of the player that was dragged.
   */
  onDragEnd({ destination, source, draggableId }) {
    if (!destination) {
      // Do nothing if dropped outside a droppable target
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // Do nothing if you're dropping the source on itself (team and position within the team is the same)
      return;
    }

    let teams = this.teamList();

    // Find new team for the player based on the team of the drop target (droppableId)
    let targetTeam = teams.find(
      (t) => t.team.id === parseInt(destination.droppableId, 10)
    );

    // Find new position for the player based on the index of the destination
    // TODO: Need to handle the case where you're dropped at the end of the list, as currently nothing would happen
    let targetOrder = targetTeam.players[destination.index].order;

    const data = {
      playerId: parseInt(draggableId, 10),
      order: targetOrder,
      teamId: targetTeam.team.id,
    };

    // Actually performed the movement
    // TODO: Make the frontend update the position immideately instead of waiting for
    // a state update from the room to avoid flicker.
    this.props.room.send({ type: "movePlayer", data });
  }

  /**
   * Removes a player from the room
   * @param {Event} e Event that triggered this action
   * @param {Object} player Player to remove
   * @param {bool} isSelf Determines if you should receive a confirmation prompt before removing or not
   */
  removePlayer(e, player, isSelf = false) {
    if (
      isSelf ||
      window.confirm(
        "Are you sure you want to remove " + player.name + " from the game?"
      )
    ) {
      e.preventDefault();

      // Notify the game room about the removal
      this.props.room.send({
        type: "removePlayer",
        data: {
          playerId: player.id,
        },
      });
    }
  }

  /**
   * Leave the room and remove all room listeners.
   * Navigates you back to the home screen
   */
  leaveRoom(e) {
    if (window.confirm("Sure you want to leave the room?")) {
      this.props.room.leave();
      this.props.room.removeAllListeners();
      this.props.history.push("/");
    }
  }

  /**
   * Returns a list of teams and the player objects associated with them
   *
   * [{team: {...}, players: [{}, {}, ...]},...]
   */
  teamList() {
    // Group teams by name
    let byName = this.props.teams.reduce((res, t) => {
      res[t.name] = t;

      return res;
    }, {});

    // Associate players with their respective teams
    let teams = Object.values(
      this.props.players.reduce((res, p) => {
        if (!(p.team in res)) {
          res[p.team] = { team: byName[p.team], players: [] };
        }

        res[p.team].players.push(p);

        return res;
      }, {})
    );

    teams.forEach(
      (t) => (t.players = t.players.sort((p1, p2) => p1.order - p2.order))
    );

    return teams;
  }

  render() {
    const teams = this.teamList();

    return (
      <Row style={{ textAlign: "left" }}>
        <Col s={12}>
          <RoomInfo
            leaveRoom={this.leaveRoom}
            roomUrl={this.props.roomUrl}
            roomId={this.props.roomId}
          ></RoomInfo>{" "}
          <Row>
            <div className="divider"></div>
          </Row>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {teams.map((t) => {
              return (
                <Droppable droppableId={t.team.id + ""} key={t.team.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      key={t.team.id}
                    >
                      <Team
                        currentState={this.props.currentState}
                        removePlayer={this.removePlayer}
                        placeholder={provided.placeholder}
                        team={t.team}
                        players={t.players}
                      ></Team>{" "}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </Col>
      </Row>
    );
  }
}

export default PlayerList;
