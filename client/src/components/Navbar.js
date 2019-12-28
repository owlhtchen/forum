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
              <li className="nav-item">
                <NavLink className="nav-link" to="/users/signup">Sign Up</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users/signin">Sign In</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users/signout" onClick={this.onClick}>Sign Out</NavLink>
              </li>
            </ul>
          </div>
        </nav>
    )
  }
}

export default connect(null, actions)(Navbar);