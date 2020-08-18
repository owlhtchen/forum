import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getCurrentContact} from "../../utils/chatroom";
import LoadingCircle from "../Loading/LoadingCircle";
import './CurrentContact.scss';
import {formatDate} from "../../utils";
import io from 'socket.io-client/dist/socket.io.js';
import {getChatRoomName} from "../../utils/user";

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

    // fetchChatRecords = async () => {
    //     const { userID } = this.props;
    //     let chatRecords = await getCurrentContact(userID);
    //     chatRecords = chatRecords.sort((record1, record2) => {
    //         if(record1.unreadMsg !== record2.unreadMsg) {
    //             return - (record1.unreadMsg - record2.unreadMsg);
    //         } else {
    //             let lastMsg1 = record1.history.slice(-1)[0];
    //             let lastMsg2 = record2.history.slice(-1)[0];
    //             if(lastMsg1 && lastMsg2) {
    //                 return - (lastMsg1.time - lastMsg2.time);
    //             } else {
    //                 return 0;
    //             }
    //         }
    //     })
    //     // console.log(chatRecords);
    //     return  chatRecords;
    // }

    async componentDidMount() {
        // let { socket} = this.state;
        // let chatRecords = await this.fetchChatRecords();
        // chatRecords.forEach((chatRecord) => {
        //     const { firstID, secondID } = chatRecord;
        //     let chatRoomName = getChatRoomName(firstID, secondID);
        //     socket.emit("room", chatRoomName);
        // });
        // this.setState({
        //     chatRecords
        // });
        // this.setState({
        //     interval: setInterval(this.fetchChatRecords, 3000)
        // });
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

    componentWillUnmount() {
        // let { socket, chatRecords } = this.state;
        // chatRecords.forEach((chatRecord) => {
        //     const { firstID, secondID } = chatRecord;
        //     let chatRoomName = getChatRoomName(firstID, secondID);
        //     socket.emit("room", chatRoomName);
        // })
        // clearInterval(this.state.interval);
        // this.setState({
        //     interval: null
        // });
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