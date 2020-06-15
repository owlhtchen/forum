import React, {Component} from 'react';
import {ReactComponent as NotificationSVG} from "../assets/notification.svg";

class NotificationDropdown extends Component {

    // TODO: notification dropdown
    handleClick = () => {

    }

    render() {
        return (
            <div className="notification" onClick={this.handleClick}>
                <NotificationSVG className="notification__svg"/>
                <div>

                </div>
            </div>
        );
    }
}

export default NotificationDropdown;