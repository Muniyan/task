import React, { Component } from "react";
import queryString from "query-string";
import { Redirect } from "react-router-dom";

class CreateCard extends Component {
  // this.state.name ::: will be used for store name field
  // this.state.desc ::: will be used for store desc field
  // this.state.card ::: will be used for store cards details
  // this.state.listId ::: will be used for store listId
  // this.state.redirect ::: will be used for redirect to list view if board is not created
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      desc: "",
      card: [],
      listId: "",
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
  }

  // Validate listId
  // Fetch Card details
  componentDidMount = () => {
    var redirect = true;
    let params = queryString.parse(this.props.location.search);
    var listId = params.lId;
    if (
      listId != null &&
      listId.trim().length > 0 &&
      this.isListExists(listId)
    ) {
      redirect = false;
    }

    this.updateState("listId", listId);
    this.updateState("redirect", redirect);

    var catchedCard = this.getItem("zoomRx-card-" + listId);
    if (catchedCard != null && catchedCard.length > 0) {
      this.updateState("card", JSON.parse(catchedCard));
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

  // Handle name field
  handleNameChange(event) {
    this.updateState("name", event.target.value);
  }

  // Handle desc field
  handleDescChange = event => {
    this.updateState("desc", event.target.value);
  };

  // Check whether card already created or not
  isCardExists = () => {
    var isExists = false;
    var localCard = this.state.card;
    var localName = this.state.name;
    localName = localName.trim();
    localCard.forEach(cardObj => {
      if (localName === cardObj.name) {
        isExists = true;
      }
    });
    return isExists;
  };

  // Check whether list already created or not
  isListExists = listId => {
    var isExists = false;
    var catchedList = this.getItem("zoomRx-list");
    if (catchedList != null && catchedList.length > 0) {
      catchedList = JSON.parse(catchedList);
      catchedList.forEach(listObj => {
        if (listId === "" + listObj.id) {
          isExists = true;
        }
      });
    }
    return isExists;
  };

  // Handle creating card details
  handleSubmit = event => {
    event.preventDefault();
    var localName = this.state.name;
    var localDesc = this.state.desc;
    localName = localName.trim();
    if (localName.length === 0) {
      alert("Card name is required");
    } else if (localName.length < 5) {
      alert("Card name must be at least 5 characters");
    } else if (localDesc.length === 0) {
      alert("Description is required");
    } else if (localDesc.length > 2000) {
      alert("Description length cannot be more than 1000 character");
    } else if (this.isCardExists()) {
      alert("Card name is already exists");
    } else {
      var localCard = this.state.card;
      var localListId = this.state.listId;
      localCard.push({
        id: new Date().getTime(),
        name: localName,
        desc: localDesc
      });

      this.updateState("redirect", true);
      this.updateState("card", localCard);
      this.setItem("zoomRx-card-" + localListId, JSON.stringify(localCard));
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
              <label className="Board-label fleft">Create Card</label>
              <input
                className="Board-input"
                type="text"
                placeholder="Card Name"
                value={this.state.name}
                onChange={this.handleNameChange}
              />
              <textarea
                className="Board-textarea"
                rows="4"
                cols="50"
                type="text"
                placeholder="Description"
                value={this.state.desc}
                onChange={this.handleDescChange}
              />
              <button className="Board-button cpointer">Create</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateCard;
