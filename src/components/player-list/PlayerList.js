import React, { Component } from 'react';
import { Row, Icon, Col } from 'react-materialize';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.teamList = this.teamList.bind(this);
    }

    onDragEnd = ({destination, source, draggableId}) => {
        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        let teams = this.teamList();

        let targetTeam = teams.find(t => t.team.id === parseInt(destination.droppableId));

        let targetOrder = targetTeam.players[destination.index].order;
       
        const data =  {
            playerId: parseInt(draggableId),
            order: targetOrder,
            teamId: targetTeam.team.id,
        };

        this.props.room.send({type: 'movePlayer', data});
    }

    removePlayer(e, player) {
        e.preventDefault();
        this.props.room.send({type: 'removePlayer', data: {
            sessionId: player.sessionId
        }});
    }

    teamList() {
        let ts = this.props.teams.reduce((res, t) => {
            res[t.name] = t;

            return res;
        }, {});

        let teams = Object.values(this.props.players.reduce((res, p) => {
            if(!(p.team in res)) {
                res[p.team] = {team: ts[p.team], players: []};
            }

            res[p.team].players.push(p);

            return res;
        }, {}));

        teams.forEach(t => t.players = t.players.sort((p1, p2) => p1.order - p2.order));

        return teams;
    }

    render() {
        const teams = this.teamList();
        
        return (
            <Row style={{textAlign: 'left'}}>
                <Col s={12}>
                    <Row>
                        <Col s={12}>
                            <p>
                                <b>Invite Players</b>
                            </p>
                            <p>
                                {this.props.roomUrl}
                            </p>
                            <p>
                                Game ID: <b>{this.props.roomId}</b>
                            </p>                            
                        </Col>
                    </Row>
                    <Row>
                        <div className="divider"></div>
                    </Row>
                    
                    <DragDropContext onDragEnd={this.onDragEnd}>
                    {teams.map(t => {
                        return (
                            <Droppable droppableId={t.team.id + ""} key={t.team.id}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} key={t.team.id}>
                                <Row>
                                    <Col s={12}>
                                        <b>{t.team.name}</b> - {t.team.score}
                                    </Col>
                                    <Col s={12}>
                                    {t.players.map((p,idx) => {
                                        return (
                                            <Draggable draggableId={p.id + ""} index={idx} key={p.id}>
                                                {provided => (
                                                <div 
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}>
                                                    <Row>
                                                        <Col s={12}>
                                                            {this.props.currentState === 'initialized' && p.ready && (
                                                                <span style={{marginRight: '8px', color: 'green'}}>
                                                                    <Icon tiny>
                                                                        done
                                                                    </Icon>
                                                                </span>
                                                            )}

                                                            {p.connectionStatus !== 'CONNECTED' && (<span onClick={e => this.removePlayer(e, p)} title="Remove" style={{color: 'red'}}><Icon tiny right>
                                                                clear
                                                            </Icon></span>)}
                                                            {p.connectionStatus !== 'CONNECTED' && (<Icon style={{color: 'red'}} tiny right>
                                                                wifi_off
                                                            </Icon>)}
                                                            {p.name}

                                                            <div className="divider"></div>
                                                        </Col>

                                                    </Row>
                                                </div>

                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    </Col>
                                    {provided.placeholder}
                                </Row>
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