import React, { Component } from 'react';
import { Select, TextInput } from 'react-materialize';

class NewGameForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numWords: 3,
            rounds: [
                {type: 'Taboo', duration: 60},
                {type: 'Charades', duration: 45},
                {type: 'One Word', duration: 30}
            ]
        }

        this.addRound = this.addRound.bind(this);
        this.removeRound = this.removeRound.bind(this);
        this.propUpdated = this.propUpdated.bind(this);
        this.roundUpdated = this.roundUpdated.bind(this);
        this.createGame = this.createGame.bind(this);
    }

    componentDidMount() {
    }

    removeRound(e, idx) {
        e.preventDefault();
        let rounds = this.state.rounds;
        
        rounds.splice(idx, 1);

        this.setState({rounds});
    }

    addRound(e) {
        e.preventDefault();
        let rounds = this.state.rounds;

        rounds.push({type: 'Taboo', duration: 60});

        this.setState({rounds});
    }

    propUpdated(e) {
        const target = e.target;
        this.setState({
          [target.name]: parseInt(target.value, 10)
        });    
    }

    roundUpdated(e, idx, prop, val) {
        let rounds = this.state.rounds;

        rounds[idx][prop] = val || e.target.value;

        this.setState({rounds: rounds});
    }

    createGame(e) {
        e.preventDefault();

        this.props.onSubmit(this.state);
    }

    render() {
        const elems = [ ...Array(20).keys() ];
        const roundTypes = [
            'Taboo',
            'Charades',
            'One Word',
            'Blanket',
            'Puppet',
            'Other'
        ];

        return (
            <div className="row">
                <form className="col s12 m8 offset-m2 l6 offset-l3" onSubmit={this.createGame}>
                    <div className="row">
                        <h5>New Game</h5>
                    </div>
                    <div className="row">
                        <div className="col s12 m6 offset-m3">
                            <Select label="Number of words per person" name="numWords" defaultValue={this.state.numWords} onChange={this.propUpdated}>
                                <option value="" disabled>Choose your option</option>
                                {elems.map((value, idx) => {
                                    return <option key={idx} value={value}>{value}</option>
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <h6>Rounds</h6>
                        </div>

                        {this.state.rounds.map((round, idx) => {
                            return (
                                <div className="row" key={idx}>
                                    <div className="col s2" style={{"marginTop": "32px"}}><b>{idx + 1}</b></div>
                                    <div className="col s6">
                                        <Select s={12} onChange={e => this.roundUpdated(e, idx, 'type')} defaultValue={round.type}>
                                            {roundTypes.map((type, i) => {
                                                return <option key={i} value={type}>{type}</option>
                                            })}
                                        </Select>
                                    </div>
                                    <div className="col s4" style={{display: 'flex', "alignItems": 'center'}}>
                                        <TextInput type="number" placeholder="duration in seconds" onChange={e => this.roundUpdated(e, idx, 'duration', parseInt(e.target.value, 10))} value={`${round.duration}`}></TextInput>s&nbsp;
                                        <a href="" onClick={e => this.removeRound(e, idx)}>Remove</a>
                                    </div>
                                    {idx < this.state.rounds.length - 1 && <div className="col s12">
                                        <div className="divider"></div>
                                    </div>}
                                </div>
                            );
                        })}
                    </div>
                    <div className="row">
                        <div className="col s12" style={{textAlign: 'right'}}>
                            <button className="btn-small waves-effect waves-light" onClick={this.addRound}>Add Round
                                <i className="material-icons right">add</i>
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 divider"></div>
                    </div>
                    <div className="row">
                        <button className="btn-large waves-effect waves-light" type="submit">Start Game
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewGameForm;
