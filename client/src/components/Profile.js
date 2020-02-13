import React, { Component } from 'react'
import MessagePopup from './MessagePopup'
import { connect } from 'react-redux'
import { getUserByID } from '../utils/index'
import UploadImage from './UploadImage';
import EditBio from './EditBio';
import FollowUser from './FollowUser';
import Block from './Block';
import Collection from './Collection';
import { Link } from 'react-router-dom'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileUser: null
    };
  }

  async componentDidMount() {
    try {
      const { userID } = this.props.match.params;
      const profileUser = await getUserByID(userID);

      this.setState({
        profileUser: profileUser
      });
    } catch(err) {
      console.log("axios exception in Profile Mount");   
    }
  }

  render() {
    const { profileUser } = this.state;
    if(!profileUser) {
      return (
        <div>
          Loading ...
        </div>
      );
    }
    return (
      <div>
        <img src={"/" + profileUser.avatarFile} className="rounded-circle" width="100" height="100"/>
        <h3>{profileUser.username}</h3>
        {
          profileUser.bio.trim() !== "" &&
          <p className="h5">Bio: {profileUser.bio}</p>
        }
        {
          String(profileUser._id) === this.props.userID && [
          <UploadImage key="upload-image"></UploadImage>,
          <EditBio key="edit-bio"></EditBio>,
          <Link key="browse-history" 
            className="btn btn-outline-secondary" to={{
            pathname: "/users/browse-history",
            userID: profileUser._id
          }} >Browse History</Link>
          ]
        }
        {
          String(profileUser._id) !== this.props.userID && [
          <MessagePopup key="message-popup" receiver={profileUser._id}/>,
          <FollowUser key="follow-user" profileUser={profileUser}></FollowUser>,
          <Block key="block-user" profileUser={profileUser}></Block>
        ]}
        <h5>Articles</h5>
        <Collection profileUser={profileUser}></Collection>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID
  };
}

export default connect(mapStateToProps)(Profile);