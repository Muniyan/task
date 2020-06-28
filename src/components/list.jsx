import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import ListCard from "./listCard";
import "../styles/list.css";

class List extends Component {
  // this.state.list ::: will be used for store list details
  // this.state.name ::: will be used for assign board name
  // this.state.redirect ::: will be used for redirect to list view if board is not created
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      name: "",
      redirect: false
    };

    this.handleDeleteList = this.handleDeleteList.bind(this);
  }

  // Fetch board name
  // Fetch list details
  componentDidMount = () => {
    var name = window.localStorage.getItem("zoomRx-task");
    if (name && name.trim().length > 0) {
      this.updateState("name", name);
      this.updateState("redirect", false);
    } else {
      this.updateState("redirect", true);
    }

    var catchedList = window.localStorage.getItem("zoomRx-list");
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

  // Handle delete list
  handleDeleteList = event => {
    event.preventDefault();
    var catchedList = this.state.list;
    var listId = event.target.getAttribute(["data-list-id"]);

    catchedList.forEach((listObj, index) => {
      if (listId === "" + listObj.id) {
        catchedList.splice(index, 1);
      }
    });

    this.updateState("list", catchedList);
    this.setItem("zoomRx-list", JSON.stringify(catchedList));
  };

  // Iterate list details
  handleListInfo = () => {
    var catchedList = this.state.list;
    if (catchedList != null && catchedList.length > 0) {
      return catchedList.map(listObj => {
        return (
          <div className="List-details fleft" key={listObj.id}>
            <label className="List-name fleft">{listObj.name}</label>
            <label
              className="List-delete fright tcenter cpointer text-overflow"
              data-list-id={listObj.id}
              onClick={this.handleDeleteList}
            >
              Delete this List...
            </label>

            <ListCard listId={listObj.id} />

            <Link
              className="List-new-card cpointer text-overflow"
              to={{
                pathname: "/createcard",
                search: "?lId=" + listObj.id
              }}
            >
              Add new Card...
            </Link>
          </div>
        );
      });
    }
  };

  // Redirect to board view if board is not created
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  // rendering UI
  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <div className="List-container">
          <label className="List-header">
            Sample Board : {this.state.name}
          </label>
          <div className="List-footer">
            {this.handleListInfo()}
            <div className="List-add-detais">
              <Link
                className="List-add fleft cpointer text-overflow"
                to="/createList"
              >
                Add new List...
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default List;
