import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../styles/board.css";

class Board extends Component {
  // this.state.name ::: will be used for assign board name
  // this.state.redirect ::: will be used for redirect to list view if board is already created
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      redirect: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBoardSubmit = this.handleBoardSubmit.bind(this);
  }

  // Fetching board info from local storage
  componentDidMount = () => {
    var boardName = this.getItem("zoomRx-task");
    if (boardName && boardName.length > 0) {
      this.updateState("name", boardName);
      this.updateState("redirect", true);
    }
  };

  // Update state info
  updateState = (key, value) => {
    let sobj = {};
    sobj[key] = value;
    this.setState(sobj);
  };

  // Set state info in local storage
  setItem = (key, value) => {
    window.localStorage.setItem(key, value);
  };

  // Fetch state info from local storage
  getItem = key => {
    return window.localStorage.getItem(key);
  };

  // Update state whenever user change field
  handleNameChange = event => {
    this.updateState("name", event.target.value);
  };

  // Validate user inut
  // Udate state and local storage and redirect to list view
  handleBoardSubmit = event => {
    event.preventDefault();
    var localName = this.state.name;
    localName = localName.trim();
    if (localName.length === 0) {
      alert("Board name is required");
    } else if (localName.length < 5) {
      alert("Board name must be at least 5 characters");
    } else {
      this.updateState("redirect", true);
      this.setItem("zoomRx-task", localName);
    }
  };

  // Redirect to list page if board is already created
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/list" />;
    }
  };

  // rendering UI
  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <div className="Board-parent">
          <div className="Board-container">
            <form
              className="Board-main fleft"
              onSubmit={this.handleBoardSubmit}
            >
              <label className="Board-label fleft">Create Board</label>
              <input
                className="Board-input"
                type="text"
                placeholder="Board Name"
                value={this.state.name}
                onChange={this.handleNameChange}
              />
              <button className="Board-button cpointer">Create</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Board;
