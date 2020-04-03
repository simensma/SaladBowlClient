import React, { Component } from 'react';
import {Col, Row, TextInput} from 'react-materialize';

class SubmitWordsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: new Array(props.numWords).fill('')
        };

        this.submitWords = this.submitWords.bind(this);
        this.wordUpdated = this.wordUpdated.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    wordUpdated(e, idx) {
        let words = this.state.words;

        words[idx] = e.target.value;

        this.setState({words: words});
    }

    submitWords(e) {
        e.preventDefault();

        this.props.onSubmit(this.state);
    }

    startGame(e) {
        e.preventDefault();
        this.props.onStartSubmit();
    }

    render() {
        if(this.props.player.ready) {
            const notReady = this.props.players.some(p => !p.ready);

            return (
                <Row>
                    <form className="col s12" onSubmit={this.startGame}>
                        <Row>
                            <h4>{notReady? 'Waiting for everyone to submit words': 'Waiting for game to start'}</h4>
                        </Row>
                        
                        <Row>
                            <input type="submit" disabled={notReady} className="btn-large waves-effect waves-light" value="Start game"></input>  
                        </Row>
                    </form>
                </Row>
            );
        } else {
            return (
                <Row>
                    <form className="col s12 m8 offset-m2" onSubmit={this.submitWords}>
                        <Row>
                            <Col s={12}>
                                <h5>Submit your words</h5>
                            </Col>
                        </Row>
                        
                        {this.state.words.map((val, idx) => {
                            return(
                                <Row key={idx}>
                                    <TextInput data-length={150} s={12} label={('Word ' + (idx + 1))} onChange={e => this.wordUpdated(e, idx)}></TextInput>
                                </Row>
                            )
                        })}

                        <Row>
                            <input className="btn-large waves-effect waves-light" type="submit" value="Submit"></input>
                        </Row>
                    </form>
                </Row>
            );
        }
    }
}

export default SubmitWordsForm;
