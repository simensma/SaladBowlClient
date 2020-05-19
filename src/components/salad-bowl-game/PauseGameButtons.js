import React from 'react';
import autoBind from 'react-autobind/lib/autoBind';
import PropTypes from 'prop-types';
import { Button, Icon } from 'react-materialize';

/**
 * Component that renders a play/pause button depending on the `paused` prop
 */
class PauseGameButtons extends React.Component {

    static propTypes = {
        // Determines if this component is in a paused state
        paused: PropTypes.bool,
        // Called when play is pressed
        onPlay: PropTypes.func,
        // Called when pause is pressed
        onPause: PropTypes.func,
    };

    constructor(props) {
        super();
        autoBind(this);
    }

    play(e) {
        e.preventDefault();
        this.props.onPlay();
    }

    pause(e) {
        e.preventDefault();
        this.props.onPause();
    }

    render() {
        return (
        <span>
            {!this.props.paused && <Button small waves="light" onClick={e => this.pause(e)}><Icon>pause</Icon></Button>}
            {this.props.paused && <Button small waves="light" onClick={e => this.play(e)}><Icon>play_arrow</Icon></Button>}
        </span>)
    }
}

export default PauseGameButtons;