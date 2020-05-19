import React from 'react';
import autoBind from 'react-autobind/lib/autoBind';
import PropTypes from 'prop-types';
import { Select, TextInput, Row, Col } from 'react-materialize';

// Default round types to select from
const ROUND_TYPES = [
    'Taboo',
    'Charades',
    'One Word',
    'Blanket',
    'Puppet',
    'Other'
];

/**
 * Component for editing the properties of a round
 */
class RoundInput extends React.Component {

    static propTypes = {
        // Name of component
        name: PropTypes.string,
        // Default type of round
        type: PropTypes.string,
        // Default duration for round (s)
        duration: PropTypes.number,
        // Called when a property has been updated
        onUpdate: PropTypes.func,
        //Called when the round was removed
        onRemove: PropTypes.func,
    };

    constructor() {
        super();
        autoBind(true);
    }

    updateRound(e, prop, value) {
        e.preventDefault();

        this.props.onUpdate(prop, value);
    }

    removeRound(e) {
        e.preventDefault();

        this.props.onRemove();
    }

    render() {
        return(
            <Row>
                <Col s={2} style={{'marginTop': '32px'}}>
                    <b>{this.props.name}</b>
                </Col>
                <Col s={6}>
                    <Select
                            s={12}
                            onChange={e => this.updateRound(e, 'type', e.target.value)}
                            defaultValue={this.props.type}>
                        {ROUND_TYPES.map((type, i) => (<option key={i} value={type}>{type}</option>))}
                    </Select>
                </Col>
                <Col s={4} style={{display: 'flex', 'alignItems': 'center'}}>
                    <TextInput
                        type="number"
                        placeholder="duration in seconds"
                        onChange={e => this.updateRound(e, 'duration', parseInt(e.target.value, 10))}
                        value={`${this.props.duration}`}>    
                    </TextInput>s&nbsp;
                    <a href="" onClick={e => this.removeRound(e)}>Remove</a>
                </Col>
            </Row>
        );
    }
}

export default RoundInput;