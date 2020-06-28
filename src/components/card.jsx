import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Comments from "./comments";
import queryString from "query-string";
import "../styles/card.css";

class Card extends Component {
  // this.state.card ::: will be used for store cards details
  // this.state.listId ::: will be used for fetch respective cards details for given listId
  // this.state.redirect ::: will be used for redirect to list view if board is not created
  constructor(props) {
    super(props);

    this.state = {
      card: [],
      listId: "",
      redirect: false
    };

    this.handleDeleteCard = this.handleDeleteCard.bind(this);
  }

  // Fetch board name
  // Fetch list details
  componentDidMount = () => {
    var catchedCard = {},
      isValid = false;
    const values = queryString.parse(this.props.location.search);
    var cardId = values.cId;
    var listId = values.lId;
    if (listId != null && listId.trim().length > 0) {
      var cardArr = this.getItem("zoomRx-card-" + listId);
      cardArr = JSON.parse(cardArr);

      cardArr.forEach(cobj => {
        if (cardId === "" + cobj.id) {
          isValid = true;
          catchedCard = cobj;
        }
      });

      this.updateState("listId", listId);
      this.updateState("card", catchedCard);
      this.updateState("redirect", !isValid);
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

  // Handle delete card
  handleDeleteCard = event => {
    var listId = this.state.listId;
    var catchedCard = this.getItem("zoomRx-card-" + listId);
    var cardId = event.target.getAttribute(["data-card-id"]);
    catchedCard = JSON.parse(catchedCard);
    catchedCard.forEach((cardObj, index) => {
      if (cardId === "" + cardObj.id) {
        catchedCard.splice(index, 1);
      }
    });

    this.updateState("redirect", true);
    this.updateState("card", catchedCard);
    this.setItem("zoomRx-card-" + listId, JSON.stringify(catchedCard));
  };

  // Redirect to list view if card is not created
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/list" />;
    }
  };

  // rendering UI
  render() {
    var catchedCard = this.state.card;
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <div className="Card-container">
          <label className="Card-header">Sample Card</label>
          <div className="Card-footer">
            <div className="Card-details fleft" key={catchedCard.id}>
              <label className="Card-name">{catchedCard.name}</label>
              <label className="Card-desc fleft">{catchedCard.desc}</label>
              <label
                className="Card-delete fright cpointer tcenter text-overflow"
                data-card-id={catchedCard.id}
                onClick={this.handleDeleteCard}
              >
                Delete Card
              </label>
            </div>

            <Comments cardId={catchedCard.id} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Card;
