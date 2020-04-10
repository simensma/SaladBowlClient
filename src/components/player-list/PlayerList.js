import React, { Component } from 'react';
import { Row, Icon, Col } from 'react-materialize';

class PlayerList extends Component {
    render() {
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
                    
                    {teams.map(t => {
                        return (
                            <Row key={t.team.name}>
                                <Col s={12}>
                                    <b>{t.team.name}</b> - {t.team.score}
                                </Col>
                                <Col s={12}>
                                {t.players.map((p,idx) => {
                                    return (
                                        <Row key={p.name + idx}>
                                            <Col s={12}>
                                                {this.props.currentState === 'initialized' && p.ready && (
                                                    <span style={{marginRight: '8px', color: 'green'}}>
                                                        <Icon tiny>
                                                            done
                                                        </Icon>
                                                    </span>
                                                )}

                                                <Icon tiny right>
                                                    {p.connectionStatus === 'CONNECTED'? 'wifi': 'wifi_off'}
                                                </Icon>
                                                {p.name}

                                                <div className="divider"></div>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                </Col>
                            </Row>
                        );
                    })}
                </Col>
            </Row>
        );
    }
}
 
export default PlayerList;