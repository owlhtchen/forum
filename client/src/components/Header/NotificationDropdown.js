import React, {Component} from 'react';
import {ReactComponent as NotificationSVG} from "../assets/notification.svg";
import { connect } from 'react-redux';
import './NotificationDropdown.scss';
import {getNotifications} from "../../utils/notification";
import MarkdownView from "../MarkdownView/MarkdownView";

class NotificationDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            shown: false
        }
    }

    handleClick = async () => {
        const { userID } = this.props;
        const { shown } = this.state;
        let messages = await getNotifications(userID);
        this.setState({
            messages,
            shown: !shown
        });
    }

    close = () => {
        this.setState({
            shown: false
        });
    }

    render() {
        let { messages, shown } = this.state;
        let messagesDropdown;
        if(messages.length !== 0) {
            messagesDropdown = messages.map(message => {
                return (
                    <div key={message._id} className="notification__dropdown-item">
                        <MarkdownView
                            content={message.content}
                            collapsed={false}
                        />
                    </div>
                );
            });
        } else {
            messagesDropdown = [
                <MarkdownView
                    key={"empty_dropdown"}
                    content={"No notification so far."}
                    collapsed={false}
                />
            ];
        }
        return (
            <div className="notification">
                <NotificationSVG className="notification__svg" onClick={this.handleClick}/>
                {
                    shown &&
                    <div className="notification__dropdown">
                        <span className="notification__dropdown-close"
                              onClick={this.close}
                        >
                            X
                        </span>
                        {messagesDropdown}
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(NotificationDropdown);