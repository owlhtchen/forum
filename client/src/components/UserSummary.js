import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class UserSummary extends Component {
  
  render() {
    const { user } = this.props;

    return (
      <div className="row m-2">
        <div className="col-2">
          <img src={"/" + user.avatarFile} className="rounded-circle img-fluid"/>
        </div>
        <div className="col-10">
          <Link className="h4" to={'/users/profile/' + user._id}>{user.username}</Link>
          {
            user.bio.trim() !== "" &&
            <p className="h5">Bio: {user.bio}</p>
          }          
        </div>
      </div>
    )
  }
}
