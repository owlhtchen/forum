import React, {Component} from 'react';
import './MessageBox.scss';
import ProfileSmall from "../Profile/ProfileSmall";
import {ReactComponent as SendSVG} from "../assets/send.svg";

class MessageBox extends Component {

    handleSend = (e) => {
        e.preventDefault();
        console.log("Send!");
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
                    <input/>
                    <button type="submit">
                        <SendSVG />
                    </button>
                </form>
            </div>
        );
    }
}

export default MessageBox;