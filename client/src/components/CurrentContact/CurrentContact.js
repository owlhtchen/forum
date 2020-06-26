import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getCurrentContact} from "../../utils/chatroom";
import LoadingCircle from "../Loading/LoadingCircle";

class CurrentContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatRecords: null
        };
    }

    async componentDidMount() {
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
        this.setState({
            chatRecords
        });
    }

    render() {
        const { userID } = this.props;
        let { chatRecords } = this.state;
        if(!chatRecords) {
            return <LoadingCircle width={"6rem"}/>;
        }
        console.log(chatRecords);
        return (
            <div className="current-contact">
                {
                    chatRecords.map(chatRecord => {
                        let other = (chatRecord.firstID === userID) ? chatRecord.second : chatRecord.first;
                        return (
                          <div
                            key={chatRecord._id}
                          >
                              {other.username}
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