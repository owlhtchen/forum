import React, {Component} from 'react'
import {Link, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import NotificationDropdown from './NotificationDropdown'
import SearchBar from './SearchBar'
import * as actions from '../../actions';
import './Header.scss';
import NavLinkTooltip from "./NavLinkTooltip";
import {ReactComponent as ArticleSVG} from "../assets/article.svg";
import {ReactComponent as DiscussSVG} from "../assets/discuss.svg";
import {ReactComponent as LogoutSVG} from "../assets/logout.svg";
import {ReactComponent as ProfileSVG} from "../assets/profile.svg";

class Header extends Component {
    signOut = () => {
        this.props.signOut();
    };

    render() {

        const {userID} = this.props;
        return (
            <header className="header">
                <Link className="header__brand" to="/">Forum</Link>

                <SearchBar/>

                <ul className="header__nav">

                    {this.props.isAdmin &&
                    <NavLink className="nav-link" to="/categories/edit-category" activeClassName="nav-active">Edit Category</NavLink>}

                    {this.props.isAuthed ? [
                        <NotificationDropdown key="notification-dropdown"/>,
                        <NavLinkTooltip
                            tooltip = "Ask or Discuss"
                            text="Discuss"
                            to={{ pathname: "/posts/make-post",
                            state: {"postType": "article"} }}
                            key="navlink-discuss">
                            <DiscussSVG />
                        </NavLinkTooltip>,
                        <NavLinkTooltip
                            tooltip = "Write an article"
                            text="Article"
                            to={{ pathname: "/posts/make-post",
                                state: {"postType": "article"} }}
                            key="navlink-article" >
                            <ArticleSVG />
                        </NavLinkTooltip>,
                        <NavLinkTooltip
                            tooltip = "View Profile"
                            to={{ pathname: "/users/profile/" + userID }}
                            key="navlink-profile">
                            <ProfileSVG />
                        </NavLinkTooltip>,
                        <div className="nav-div"
                            onClick={this.signOut}
                            key="navlink-signout">
                            <LogoutSVG />
                        </div>,
                    ] : [
                        <div className="header__nav-square" key="signup">
                            <NavLink to="/users/signup">Sign Up</NavLink>
                        </div>,
                        <div className="header__nav-square" key="signin">
                            <NavLink to="/users/signin">Sign In</NavLink>
                        </div>
                    ]}
                </ul>

            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.user.isAuthed,
        userID: state.user.userID,
        isAdmin: state.user.isAdmin
    }
};

export default connect(mapStateToProps, actions)(Header);