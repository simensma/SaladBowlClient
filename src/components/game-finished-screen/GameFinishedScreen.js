import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for when the game is finished.
 *  - Displays a list of all teams and their associated score
 */
class GameFinishedScreen extends React.Component {

    static propTypes = {
        // Array of teams ({name, score})
        teams: PropTypes.array
    };

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
