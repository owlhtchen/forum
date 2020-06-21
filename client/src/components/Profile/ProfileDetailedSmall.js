import React, {Component} from 'react';
import './ProfileSmall.scss';

class ProfileSmall extends Component {

    handleClick = () => {
        const { user, setSelectedUser } = this.props;
        if(setSelectedUser) {
            setSelectedUser(user);
        }
    }

    render() {
        const { user } = this.props;
        return (
            <div className="profile-small" onClick={this.handleClick}>
                <img src={`/${user.avatarFile}`} alt="user avatar" className="profile-small__icon"/>
                <span>{user.username}</span>
            </div>
        );
    }
}

export default ProfileSmall;