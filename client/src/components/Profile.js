import React, { Component } from 'react'
import axios from 'axios'
import MessagePopup from './MessagePopup'
import { connect } from 'react-redux'
import { getUserByID } from '../utils/index'
import UploadImage from './UploadImage';
import EditBio from './EditBio';
import FollowUser from './FollowUser';
import Block from './Block';

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
        <p className="h5">Bio: {profileUser.bio}</p>
        {
          String(profileUser._id) === this.props.userID && [
          <UploadImage key="upload-image"></UploadImage>,
          <EditBio key="edit-bio"></EditBio>
          ]
        }
        {
          String(profileUser._id) !== this.props.userID && [
          <MessagePopup key="message-popup" receiver={profileUser}/>,
          <FollowUser key="follow-user" profileUser={profileUser}></FollowUser>,
          <Block key="block-user" profileUser={profileUser}></Block>
        ]}
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