import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Navbar extends Component {
  onClick = () => {
    this.props.signOut();
  }

  render() {
    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
          <Link className="navbar-brand" to="#">Forum</Link>

          <div className="collapse navbar-collapse">
            
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              { this.props.isAuthed ? [
                <li className="nav-item" key="makepost">
                  <NavLink className="nav-link" to="/posts/makepost">Make Post</NavLink>
                </li>,              
                <li className="nav-item" key="signout">
                  <NavLink className="nav-link" to="/users/signout" onClick={this.onClick}>Sign Out</NavLink>
                </li>
              ] : [
                <li className="nav-item" key="signup">
                  <NavLink className="nav-link" to="/users/signup">Sign Up</NavLink>
                </li>, 
                <li className="nav-item" key="signin">
                  <NavLink className="nav-link" to="/users/signin">Sign In</NavLink>
                </li>                
              ]}
            </ul>
          </div>
        </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthed: state.user.isAuthed
  }
}

export default connect(mapStateToProps, actions)(Navbar);