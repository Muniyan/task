import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class CreateList extends Component {
  // this.state.name ::: will used for card name
  // this.state.list ::: will be used for fetch list info
  // this.state.redirect ::: will be used for redirect to list view if board is not created
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      list: [],
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Fetch list info
  componentDidMount = () => {
    var catchedList = this.getItem("zoomRx-list");
    if (catchedList != null && catchedList.length > 0) {
      this.updateState("list", JSON.parse(catchedList));
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

  // Update state whenever user change name of list
  handleChange = event => {
    this.updateState("name", event.target.value);
  };

  // Check whether list name already created or not
  isListExists = () => {
    var isExists = false;
    var catchedList = this.state.list;
    var localName = this.state.name;
    localName = localName.trim();
    catchedList.forEach(listObj => {
      if (localName === listObj.name) {
        isExists = true;
      }
    });
    return isExists;
  };

  // Handle creat card info
  handleSubmit = event => {
    event.preventDefault();
    var localName = this.state.name;
    localName = localName.trim();
    if (localName.length === 0) {
      alert("List name is required");
    } else if (localName.length < 5) {
      alert("List name must be at least 5 characters");
    } else if (this.isListExists()) {
      alert("List name is already exists");
    } else {
      var catchedList = this.state.list;
      catchedList.push({ id: new Date().getTime(), name: localName });
      this.setItem("zoomRx-list", JSON.stringify(catchedList));
      this.updateState("list", catchedList);
      this.updateState("redirect", true);
    }
  };

  // Redirect to list view if card is created by successfully
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
            <form className="Board-main fleft" onSubmit={this.handleSubmit}>
              <label className="Board-label fleft">Create List</label>
              <input
                className="Board-input"
                type="text"
                placeholder="List Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <button className="Board-button cpointer">Create</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateList;
