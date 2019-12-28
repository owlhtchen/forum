import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom';

export default class Navbar extends Component {
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
                <NavLink className="nav-link" to="/users/signout">Sign Out</NavLink>
              </li>
            </ul>
          </div>
        </nav>
    )
  }
}

