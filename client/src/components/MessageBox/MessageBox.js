import React, {Component} from 'react';
import './MessageBox.scss';
import ProfileSmall from "../Profile/ProfileSmall";
import {ReactComponent as SendSVG} from "../assets/send.svg";
import { connect } from 'react-redux';

import io from 'socket.io-client/dist/socket.io.js';
import {getChatRoomName, getUserByID} from "../../utils/user";
import {getAllChatHistory} from "../../utils/chatroom";
import LoadingCircle from "../Loading/LoadingCircle";

class MessageBox extends Component {

    reset = () => {
        let input = document.querySelector(".message-box__input");
        input.value = "";
    }

    constructor(props) {
        super(props);
        let socket =  io('http://localhost:8080/');
        socket.on("new message", (lastMessage) => {
            const prev = [...this.state.messages];
            prev.push(lastMessage);
            console.log("on new message: ", prev);

            this.setState({
                messages: prev
            });
        })
        this.state = {
            socket: socket,
            sender: null,
            messages: []   // chatroom.history
        }
    }

    setUpChat = async () => {
        const { userID, selectedReceiver } = this.props;
        let { socket } = this.state;
        let receiverID = selectedReceiver._id;
        let user = await getUserByID(userID);
        let history = await getAllChatHistory(userID, receiverID);
        this.setState({
            sender: user,
            messages: history
        })
        console.log("after mount: ", this.state.messages);
        let chatRoomName = getChatRoomName(userID, receiverID);
        socket.emit("room", chatRoomName);
    }

    async componentDidMount() {
        await this.setUpChat();
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
        const { selectedReceiver, userID } = this.props;
        const { sender } = this.state;
        const { messages } = this.state;
        if(!selectedReceiver) {
            return <h2>Let's start a chat! Click the icon on the left side.</h2>;
        }
        if(!sender || !selectedReceiver) {
            return <LoadingCircle width={"12rem"} />
        }
        return (
            <div className="message-box">
                <ProfileSmall user={selectedReceiver} />
                <div className="message-box__content">
                    {
                        messages.map(message => {
                            let fromUser =
                                (message.senderID.toString() === userID) ? sender : selectedReceiver;
                            return (
                              <div
                                key={message._id}
                              >{`${fromUser.username}: ${message.content}`}</div>
                            );
                        })
                    }
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