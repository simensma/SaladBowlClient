import React, { Component } from 'react';

class GameFinishedScreen extends Component {
    render() {
        return (
            <div>
                <h1>Game FInished!!</h1>

                {this.props.teams.map(team => {
                    return (<div>{team.name}: {team.score} points</div>);
                })}
            </div>
        );
    }
}

export default GameFinishedScreen;
