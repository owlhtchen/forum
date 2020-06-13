import React, {Component} from 'react'
import {Link, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import NotificationDropdown from './NotificationDropdown'
import SearchBar from './SearchBar'
import * as actions from '../../actions';
import './Navbar.scss';

class Navbar extends Component {
    onClick = () => {
        this.props.signOut();
    };

    render() {
        const {userID} = this.props;
        return (
            <header className="header">
                <Link className="header__brand" to="/">Forum</Link>

                <SearchBar></SearchBar>


                <ul className="header__nav">

                    {this.props.isAdmin &&
                    <NavLink className="nav-link" to="/categories/edit-category" activeClassName="nav-active">Edit Category</NavLink>}
                    {this.props.isAuthed ? [
                        <li className="nav-item" key="notification">
                            <NotificationDropdown userID={this.props.userID}/>
                        </li>,
                        <li className="nav-item" key="makearticle">
                            <NavLink className="nav-link" to={{
                                pathname: "/posts/make-post",
                                state: {"postType": "article"}
                            }}>Write Article</NavLink>
                        </li>,
                        <li className="nav-item" key="makepost">
                            <NavLink className="nav-link" to={{
                                pathname: "/posts/make-post",
                                state: {"postType": "post"}
                            }}>Make Post</NavLink>
                        </li>,
                        <li className="nav-item" key="profile">
                            <NavLink className="nav-link" to={"/users/profile/" + userID}>Profile</NavLink>
                        </li>,
                        <li className="nav-item" key="signout">
                            <NavLink className="nav-link" to="/users/signout" onClick={this.onClick}>Sign Out</NavLink>
                        </li>
                    ] : [
                        <div className="header__nav-square" key="signup">
                            <NavLink className="nav-link" to="/users/signup">Sign Up</NavLink>
                        </div>,
                        <div className="header__nav-square" key="signin">
                            <NavLink className="nav-link" to="/users/signin">Sign In</NavLink>
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

export default connect(mapStateToProps, actions)(Navbar);