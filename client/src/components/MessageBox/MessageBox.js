import React, {Component} from 'react';
import './MessageBox.scss';
import ProfileSmall from "../ProfileSummary/ProfileSmall";
import {ReactComponent as SendSVG} from "../assets/send.svg";
import { connect } from 'react-redux';

import {getChatRoomName, getUserByID} from "../../utils/user";
import {getAllChatHistory, markAsRead} from "../../utils/chatroom";
import LoadingCircle from "../Loading/LoadingCircle";

class MessageBox extends Component {

    reset = () => {
        let input = document.querySelector(".message-box__input");
        input.value = "";
    }

    constructor(props) {
        super(props);
        let { socket } =  this.props;
        socket.on("new message", (lastMessage) => {
            const prev = [...this.state.messages];
            prev.push(lastMessage);

            this.setState({
                messages: prev
            });
            this.scrollToBottom();
        })
        this.state = {
            sender: null,
            messages: []   // chatroom.history
        }
    }

    setUpChat = async () => {
        const { userID, selectedReceiver } = this.props;
        let receiverID = selectedReceiver._id;
        let user = await getUserByID(userID);
        let messages = await getAllChatHistory(userID, receiverID);
        this.setState({
            sender: user,
            messages: messages
        })
        // console.log("after mount: ", this.state.messages);
        let chatRoomName = getChatRoomName(userID, receiverID);
    }

    scrollToBottom = () => {
        let content = document.querySelector(".message-box__content");
        if(content) {
            content.scrollTop = content.scrollHeight; // keep scrolled to bottom
        }
    }

    async componentDidMount() {
        await this.setUpChat();
        this.scrollToBottom();
        const { userID, selectedReceiver } = this.props;
        await markAsRead(userID, selectedReceiver._id);
    }

    async componentWillUnmount() {
        const { userID, selectedReceiver } = this.props;
        await markAsRead(userID, selectedReceiver._id);
    }

    handleSend = (e) => {
        e.preventDefault();
        let content = document.querySelector(".message-box__input").value;
        const { selectedReceiver } = this.props;
        const { sender } = this.state;
        if(!content || !content.trim() || !selectedReceiver || !sender) {
            return;
        }
        let { socket } = this.props;
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