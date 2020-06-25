import React, {Component} from 'react';
import './MessageBox.scss';
import ProfileSmall from "../Profile/ProfileSmall";
import {ReactComponent as SendSVG} from "../assets/send.svg";
import { connect } from 'react-redux';

import io from 'socket.io-client/dist/socket.io.js';
import {getChatRoomName, getUserByID} from "../../utils/user";

class MessageBox extends Component {

    reset = () => {
        let input = document.querySelector(".message-box__input");
        input.value = "";
    }

    constructor(props) {
        super(props);
        this.state = {
            socket: io('http://localhost:8080/'),
            sender: null
        }
    }

    async componentDidMount() {
        const { userID, selectedReceiver } = this.props;
        let { socket } = this.state;
        let user = await getUserByID(userID);
        this.setState({
            sender: user
        })
        let chatRoomName = getChatRoomName(user._id, selectedReceiver._id);
        socket.emit("room", chatRoomName);
    }

    handleSend = (e) => {
        e.preventDefault();
        let content = document.querySelector(".message-box__input").value;
        const { selectedReceiver } = this.props;
        const { sender } = this.state;
        if(!content || !content.trim() || !selectedReceiver || !sender) {
            return;
        }
        console.log("Send! ", content);
        let { socket } = this.state;
        let senderID = sender._id;
        let receiverID = selectedReceiver._id;
        let data = {
            senderID,
            receiverID,
            content
        }
        socket.emit("new message", data);
        this.reset();
    }

    render() {
        // a isNew props ? from socket.io server?
        const { selectedReceiver } = this.props;
        if(!selectedReceiver) {
            return <h2>Let's start a chat! Click the icon on the left side.</h2>;
        }
        return (
            <div className="message-box">
                <ProfileSmall user={selectedReceiver} />
                <div className="message-box__content">
                    ##
                </div>
                <form onSubmit={this.handleSend} className="message-box__form">
                    <input className="message-box__input"/>
                    <button type="submit">
                        <SendSVG />
                    </button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(MessageBox);