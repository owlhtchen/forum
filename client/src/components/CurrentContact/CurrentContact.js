import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getCurrentContact} from "../../utils/chatroom";
import LoadingCircle from "../Loading/LoadingCircle";
import './CurrentContact.scss';
import {formatDate} from "../../utils";

class CurrentContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatRecords: null,
            interval: null
        };
    }

    fetchChatRecords = async () => {
        const { userID } = this.props;
        let chatRecords = await getCurrentContact(userID);
        chatRecords = chatRecords.sort((record1, record2) => {
            if(record1.unreadMsg !== record2.unreadMsg) {
                return - (record1.unreadMsg - record2.unreadMsg);
            } else {
                let lastMsg1 = record1.history.slice(-1)[0];
                let lastMsg2 = record2.history.slice(-1)[0];
                if(lastMsg1 && lastMsg2) {
                    return - (lastMsg1.time - lastMsg2.time);
                } else {
                    return 0;
                }
            }
        })
        // console.log(chatRecords);
        this.setState({
            chatRecords
        });
    }

    componentDidMount() {
        this.setState({
            interval: setInterval(this.fetchChatRecords, 3000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.setState({
            interval: null
        });
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
                              onClick={() => {setSelectedUser(other)}}
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