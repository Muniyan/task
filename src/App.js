import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";

import List from "./components/list";
import Card from "./components/card";
import CreateList from "./components/createList";
import CreateCard from "./components/createCard";
import Board from "./components/board";

import "./App.css";

class App extends Component {
  render() {
    const App = () => (
      <Switch>
        <Route exact path="/" component={Board} />
        <Route exact path="/list" component={List} />
        <Route exact path="/card" component={Card} />
        <Route exact path="/createlist" component={CreateList} />
        <Route exact path="/createcard" component={CreateCard} />
      </Switch>
    );

    return (
      <div className="App">
        <header className="App-header">
          <span className="App-icon fleft" />
          <Link to="/" className="App-name fleft cpointer">
            To Do App
          </Link>
        </header>

        <div className="App-container fleft">
          <Switch>
            <App />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
