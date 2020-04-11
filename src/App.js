import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

import React, { Component } from 'react';
import './App.css';
import MainScreen from './components/main-screen/MainScreen';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';

class App extends Component {

  render() {
        // console.log(useParams())

    return (
      <Router>
        <Switch>
          <Route path="/game/:gameId" component={props=><MainScreen history={props.history} gameId={props.match.params.gameId}></MainScreen>}>
          </Route>
          <Route path="/" component={({history}) => <MainScreen history={history}></MainScreen>}>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
