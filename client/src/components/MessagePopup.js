import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import io from 'socket.io-client'
import { connect } from 'react-redux';

class MessagePopup extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      socket: null,
      messages: []
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    var socket = io('ws://localhost:5000');
    const sender = this.props.userID;
    const receiver = this.props.receiver;
    if(sender < receiver){
      socket.emit("room", sender);
    } else {
      socket.emit("room", receiver);
    }
    socket.on("new message", (data) => {
      console.log(data);
      // const messages = this.state.messages.concat([data]);
      // this.setState({
      //   messages: messages
      // });
    })
    this.setState({ 
      open: true,
      socket: socket
    });
  }
  closeModal() {
    this.setState({ open: false });
  }

  handleSend = () => {
    // console.log("sent");
    const { socket } = this.state;
    const sender = this.props.userID;
    const receiver = this.props.receiver;
    const message = document.querySelector('#message-box').value;
    socket.emit('new message', {
      content: message,
      sender: sender,
      receiver: receiver
    })
    document.querySelector('#message-box').value = "";
  }

  render() {
    return (
      <div>
        <button className="button" onClick={this.openModal}>
          Controlled Popup
        </button>
        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="react-js-modal">
            <div>
              <a className="close" onClick={this.closeModal}>
                &times;
              </a>
              <div id="message-history">
                {this.state.messages.map(message => {
                  return (
                    <div>
                      {message.sender}:{message.content}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <input id="message-box" type="text"></input>
              <button onClick={this.handleSend}>Send</button>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(MessagePopup);