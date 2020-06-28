import React, { Component } from "react";
import "../styles/comments.css";

class Comments extends Component {
  // this.state.desc ::: will be used for store desc field
  // this.state.comments ::: will be used for store comments field
  constructor(props) {
    super(props);

    this.state = {
      desc: "",
      comments: []
    };

    this.getFormattedTime = this.getFormattedTime.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleAddComments = this.handleAddComments.bind(this);
  }

  // Receive cardId from props and fetch comments history by using cardId
  componentWillReceiveProps = newProps => {
    var catchedComments = this.state.comments;
    if (catchedComments.length === 0) {
      var localCardId = "" + newProps.cardId;
      if (localCardId && localCardId.trim().length > 0) {
        let tempComments = this.getItem("zoomRx-comments-" + localCardId);
        if (tempComments && tempComments.trim().length > 0) {
          this.updateState("comments", JSON.parse(tempComments));
        }
      }
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

  // Handle desc field
  handleDescChange = event => {
    this.updateState("desc", event.target.value);
  };

  // Convert milliseconds to display format
  getFormattedTime = ms => {
    var timeStr = "" + new Date(ms);
    var timeArr = timeStr.split(" ");
    return timeArr[2] + " " + timeArr[1] + " " + timeArr[3];
  };

  // Add new comment
  handleAddComments = event => {
    var desc = this.state.desc;
    var cardId = this.props.cardId;
    var commentsArr = this.state.comments;
    if (desc.length === 0) {
      alert("Comment is required");
    } else if (desc.length > 2000) {
      alert("Comments length cannot be more than 1000 character");
    } else {
      commentsArr.unshift({ id: new Date().getTime(), desc: desc });
      this.updateState("desc", "");
      this.updateState("comments", commentsArr);
      this.setItem("zoomRx-comments-" + cardId, JSON.stringify(commentsArr));
    }
  };

  // Render comments history
  renderCommentsHistory = () => {
    var catchedComments = this.state.comments;
    return catchedComments.map(cobj => {
      let displayTime = this.getFormattedTime(cobj.id);
      return (
        <div className="Comments-history-child" key={cobj.id}>
          <label className="Comments-history-desc">{cobj.desc}</label>
          <label className="Comments-history-time">{displayTime}</label>
        </div>
      );
    });
  };

  // rendering UI
  render() {
    return (
      <React.Fragment>
        <div className="Comments-container">
          <textarea
            type="text"
            placeholder="add comments here"
            className="Comments-textarea"
            value={this.state.desc}
            onChange={this.handleDescChange}
          />
          <label className="Comments-add" onClick={this.handleAddComments}>
            Add Comment
          </label>
          <div className="Comments-history">{this.renderCommentsHistory()}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Comments;
