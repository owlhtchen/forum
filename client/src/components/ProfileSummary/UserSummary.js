import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {formatDate} from "../../utils";
import './UserSummary.scss';

export default class UserSummary extends Component {

    render() {
        const { user } = this.props;
        return (
            <div className="user-summary">
                <Link to={`/users/profile/${user._id}`} className="user-summary__wrap">
                        <img src={`/${user.avatarFile}`} alt="user avatar" className="user-summary__icon"/>
                        <span>{user.username}</span>
                        <span className="user-summary__secondary">- {user.bio}</span>
                        <span className="user-summary__secondary">joined {formatDate(new Date(user.joinDate))}</span>
                </Link>
            </div>
        );
    }
}
