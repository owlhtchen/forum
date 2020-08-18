import React, {Component} from 'react';
import { connect } from 'react-redux';
import LoadingCircle from "../Loading/LoadingCircle";
import './CurrentContact.scss';
import {formatDate} from "../../utils";

class CurrentContact extends Component {
    constructor(props) {
        super(props);
        // let socket =  io();
        this.state = {
            // socket: socket,
            chatRecords: this.props.chatRecords,
            interval: null
        };
    }

    async componentDidMount() {
        let { socket, userID } = this.props;
        const { chatRecords } = this.state;
        let prevChatRecords = JSON.parse(JSON.stringify(chatRecords));
        socket.on("new message", (lastMessage) => {
            prevChatRecords.forEach((chatRecord) => {
                const { firstID, secondID } = chatRecord;
                const otherID = (userID.toString() === firstID.toString()) ? secondID.toString() : firstID.toString();
                if((otherID === lastMessage.receiverID.toString() &&
                    userID.toString() === lastMessage.senderID.toString()) ||
                    (otherID === lastMessage.senderID.toString() &&
                        userID.toString() === lastMessage.receiverID.toString())
                ) {

                    chatRecord.history.push(lastMessage);
                    if(lastMessage.receiverID.toString() === userID.toString()) {
                        if(chatRecord.unreadMsg) {
                            chatRecord.unreadMsg += 1;
                        } else {
                            chatRecord.unreadMsg = 1;
                        }
                    }
                }
            });
            this.setState({
                chatRecords: prevChatRecords
            });
        })
    }

    selectUser = (other, chatRecord) => {
        const { setSelectedUser } = this.props;
        setSelectedUser(other);
        const { chatRecords } = this.state;
        let prevChatRecords = JSON.parse(JSON.stringify(chatRecords));
        prevChatRecords.forEach((prevChatRecord) => {
            if(prevChatRecord.firstID === chatRecord.firstID &&
                prevChatRecord.secondID === chatRecord.secondID
            ) {
                chatRecord.unreadMsg = 0;
            }
        });
        this.setState({
            chatRecord: prevChatRecords
        })
    }


    render() {
        const { userID, setSelectedUser } = this.props;
        let { chatRecords } = this.state;
        if(!chatRecords) {
            return <LoadingCircle width={"6rem"}/>;
        }
        return (
            <div className="current-contact">
                <h3>Contacts</h3>
                {
                    chatRecords.map(chatRecord => {
                        let other = (chatRecord.firstID === userID) ? chatRecord.second : chatRecord.first;
                        let lastMsg = chatRecord.history.slice(-1)[0];
                        return (
                          <div
                              onClick={() => {this.selectUser(other, chatRecord)}}
                              className="chat-overview"
                            key={chatRecord._id}
                          >
                              <div className="chat-overview__left">
                                  <img src={`/${other.avatarFile}`} alt="" className="chat-overview__img"/>
                              </div>
                              <div className="chat-overview__right">
                                  <div className="chat-overview__top">
                                      <span className="chat-overview__primary">{other.username}</span>
                                      <span className="chat-overview__sub">{formatDate(new Date(lastMsg.time))}</span>
                                  </div>
                                  <div className="chat-overview__bottom chat-overview__sub">
                                      <span>
                                          {lastMsg.content}
                                      </span>
                                  </div>
                                  {
                                      chatRecord.unreadMsg >  0 &&
                                      <span className="chat-overview__sub chat-overview__badge">
                                          {chatRecord.unreadMsg}
                                      </span>
                                  }
                              </div>
                          </div>
                        );
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(CurrentContact);