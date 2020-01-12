import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import io from 'socket.io-client'
import { connect } from 'react-redux';
import axios from 'axios';
import { getUserByID } from '../utils/index'

class MessagePopup extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      socket: null,
      messages: [],
      user: null,
      blocked: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    const { userID } = this.props;
    let user = await getUserByID(userID);
    this.setState({
      user: user
    });
  }

  openModal() {
    // if(true) {
    //   const blockMsg = [{
    //     'senderUsername': "⚠️🤡",
    //     'content': 'conversation has been blocked'
    //   }];
    //   this.setState({
    //     messages: blockMsg
    //   });
    // }
    var socket = io('ws://localhost:5000');
    const sender = this.props.userID;   // ID
    const receiver = this.props.receiver;   // ID
    if(sender < receiver){
      socket.emit("room", sender);
    } else {
      socket.emit("room", receiver);
    }
    socket.on("new message", (data) => {
      const messages = this.state.messages.concat([data]);
      this.setState({
        messages: messages
      });
    })
    this.setState({ 
      open: true,
      socket: socket
    });
  }
  closeModal() {
    if(this.state.socket)
      this.state.socket.close();
    this.setState({ 
      open: false,
      socket: null
     });
  }

  handleSend = () => {
    const { socket } = this.state;
    const sender = this.props.userID;
    const receiver = this.props.receiver;
    const message = document.querySelector('#message-box').value;
    socket.emit('new message', {
      content: message,
      sender: sender,
      receiver: receiver,
      senderUsername: this.state.user.username
    })
    document.querySelector('#message-box').value = "";
  }

  render() {
    return (
      <div>
        <button className="button" onClick={this.openModal}>
          Send Message
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
              <div>
                {this.state.messages.map((message, index) => {
                  return (
                    <div key={index}>
                      {message.senderUsername}: {message.content}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="message-box">
              <input id="message-box" type="text" className="message-box-input" ></input>
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