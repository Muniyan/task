import React, { Component } from "react";
import { Link } from "react-router-dom";

class ListCard extends Component {
  // this.state.card ::: will be used for store cards details
  // this.state.listId ::: will be used for fetch respective cards details for given listId
  constructor(props) {
    super(props);

    this.state = {
      card: [],
      listId: ""
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  // Fetch card details
  // Update state info
  componentDidMount() {
    var listId = this.props.listId;
    var catchedCard = this.getItem("zoomRx-card-" + listId);
    if (catchedCard && catchedCard.length > 0) {
      catchedCard = JSON.parse(catchedCard);
      this.updateState("listId", listId);
      this.updateState("card", catchedCard);
    }
  }

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

  // Handle drag start event
  handleDragStart = event => {
    var cardId = event.target.getAttribute(["data-card-id"]);
    event.dataTransfer.setData("text/plain", cardId);
  };

  // Handle drag over event
  handleDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle drag drop event
  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    var sourceId = event.dataTransfer.getData("text/plain");
    var destinationId = event.target.getAttribute(["data-card-id"]);

    let newCards = {};
    var curCardArr = this.state.card;
    var curListId = this.state.listId;
    curCardArr.forEach((obj, index) => {
      if ("" + obj.id === sourceId) {
        newCards.sindex = index;
      } else if ("" + obj.id === destinationId) {
        newCards.dindex = index;
      }
    });

    var sindex = newCards.sindex || 0;
    var dindex = newCards.dindex || 0;
    if (sindex > -1 && dindex > -1 && sindex !== dindex) {
      var tempObj = curCardArr[sindex];
      curCardArr[sindex] = curCardArr[dindex];
      curCardArr[dindex] = tempObj;

      this.updateState("card", curCardArr);
      this.setItem("zoomRx-card-" + curListId, JSON.stringify(curCardArr));
    }
  };

  // Render list of cards details in list view
  handleListInnerCard = () => {
    var catchedCard = this.state.card;
    var localListId = this.state.listId;
    if (catchedCard != null && catchedCard.length > 0) {
      return catchedCard.map(cardObj => {
        var cardId = cardObj.id;
        var cardName = cardObj.name;
        return (
          <Link
            className="ListCard-label"
            to={{
              pathname: "/card",
              search: "?lId=" + localListId + "&cId=" + cardId
            }}
            key={cardId}
            draggable="true"
            data-card-id={cardId}
            onDragStart={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
          >
            {cardName}
          </Link>
        );
      });
    }
  };

  // rendering UI
  render() {
    var localListId = this.state.listId;
    var wrapperId = "localListId_" + localListId;
    return (
      <div id={wrapperId} className="w100 fleft">
        {this.handleListInnerCard()}
      </div>
    );
  }
}

export default ListCard;
