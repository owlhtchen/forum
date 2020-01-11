import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

class FollowUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: false
    }
  }

  async componentDidMount() {
    try {
      const { profileUser, userID } =  this.props;
      const resFollwing = await axios.post('/users/check-follow-user', {
        user: profileUser._id,
        follower: userID
      });

      this.setState({
        following: resFollwing.data
      });
    } catch(err) {
      console.log(err);   
    }
  }

  handleFollow = async () => {
    const { userID : follower, profileUser }= this.props;
    const { following } = this.state;
    try {
      await axios.post('/users/follow-user', {
        user: profileUser._id,
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

  render() {
    const { following } = this.state;
    return (
      <div>
        <button onClick={this.handleFollow}>
        {following ? "Following" : "Follow Me"}</button>        
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(FollowUser)