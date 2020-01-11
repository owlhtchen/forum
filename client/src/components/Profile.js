import React, { Component } from 'react'
import axios from 'axios'
import MessagePopup from './MessagePopup'
import { connect } from 'react-redux'
import { getUserByID } from '../utils/index'
import UploadImage from './UploadImage';
import EditBio from './EditBio';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileUser: null,
      following: false
    };
  }

  handleFollow = async () => {
    const follower = this.props.userID;
    const { profileUser, following } = this.state;
    try {
      await axios.post('/users/follow-user', {
        user: profileUser,
        follower: follower,
        startFollowing: !following
      });
      this.setState({
        following: !following
      });      
    } catch(err) {
      console.log("axios exception in Profile handle follow");  
    }
  }

  async componentDidMount() {
    try {
      const { userID } = this.props.match.params;
      const profileUser = await getUserByID(userID);
      const resFollwing = await axios.post('/users/check-follow-user', {
        user: profileUser,
        follower: this.props.userID
      });

      this.setState({
        profileUser: profileUser,
        following: resFollwing.data.following
      });
    } catch(err) {
      console.log("axios exception in Profile Mount");   
    }
  }

  render() {
    const { profileUser, following } = this.state;
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
          <MessagePopup key="message-popup" />,
          <button key="follow-button"
          onClick={this.handleFollow}
          >{following ? "Following" : "Follow Me"}</button>
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