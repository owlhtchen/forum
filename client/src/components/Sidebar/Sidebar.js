import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import './Sidebar.scss';
import { ReactComponent as HomepageSVG} from "../assets/home.svg";
import { ReactComponent as BookmarkSVG} from "../assets/bookmark.svg";
import { ReactComponent as MessageSVG} from "../assets/message.svg";
import { ReactComponent as HistorySVG} from "../assets/clock.svg";
import { ReactComponent as ProfileSVG} from "../assets/profile.svg";
import { connect } from 'react-redux';

class Sidebar extends Component {
    render() {
        const { userID } = this.props;

        return (
            <div className="sidebar">
                <NavLink className="sidebar__homepage" to="/">
                    <HomepageSVG className="sidebar__svg"/>
                    Homepage
                </NavLink>
                <NavLink className="sidebar__bookmarks" to={`/users/bookmarks/${userID}`}>
                    <BookmarkSVG className="sidebar__svg"/>
                    Bookmarks
                </NavLink>
                <NavLink className="sidebar__messages" to={`/users/messenger/${userID}`}>
                    <MessageSVG className="sidebar__svg"/>
                    Messages
                </NavLink>
                <NavLink className="sidebar__history" to={`/users/browse-history/${userID}`}>
                    <HistorySVG className="sidebar__svg"/>
                    History
                </NavLink>
                <NavLink className="sidebar__profile" to={`/users/profile/${this.props.userID}`} >
                    <ProfileSVG className="sidebar__svg"/>
                    Profile
                </NavLink>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(Sidebar);