import React, {Component} from 'react';
import './ProfileDetailedSmall.scss';
const { formatDate } = require('../../utils/index');

class ProfileDetailedSmall extends Component {

    handleClick = () => {
        const { user, setSelectedUser } = this.props;
        if(setSelectedUser) {
            setSelectedUser(user);
        }
    }

    render() {
        const { user } = this.props;
        return (
            <div className="profile-detailed-small" onClick={this.handleClick}>
                <img src={`/${user.avatarFile}`} alt="user avatar" className="profile-detailed-small__icon"/>
                <span>{user.username}</span>
                <span className="profile-detailed-small__join-date">joined {formatDate(new Date(user.joinDate))}</span>
            </div>
        );
    }
}

export default ProfileDetailedSmall;