import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { dateInfo } from '../utils/index'
import { connect } from 'react-redux'
import axios from 'axios'
const ReactMarkdown = require('react-markdown');

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: false
    };
  }

  async componentDidMount() {
    try {
      const post = this.props.post._id;  //postID
      const resFollowing = await axios.post('/posts/check-follow-post', {
        post: post,
        follower: this.props.userID
      });

      this.setState({
        following: resFollowing.data.following
      });
    } catch(err) {
      console.log("axios exception in PostDetail Mount");   
    }
  }

  handleFollow = async () => {
    const { following } = this.state;
    try {
      await axios.post('/posts/follow-post', {
        post: this.props.post._id,
        follower: this.props.userID,
        startFollowing: !following
      });
      this.setState({
        following: !following
      })
    } catch(err) {
      console.log("axios exception in PostDetail handle follow");  
    }
  }

  render() {
    const { following } = this.state;
    const { title, createDate, content, author, parentID, isDeleted } = this.props.post;

    const postDetail = (
      <div className="post-detail" id={this.props.post._id}>
       <h2 style={{display:"inline-block"}}>{ title }</h2>
        <div style={{display:"inline-block"}}>
          <span>Posted by </span>
          <Link to={'/users/profile/' + author[0]._id}>{author[0].username}</Link>
          { dateInfo(createDate) }  &nbsp;
        </div>
        {
          !parentID &&
          <button onClick={this.handleFollow}>{following ? "Unfollow" : "Follow"}</button>
        }
        <hr></hr>
        <ReactMarkdown 
        source={content}
        linkTarget="_blank"/>
         <hr></hr>
      </div>
    );

    if(isDeleted) {
      return <div>[Deleted]</div>
    }

    return (
      <div>
        {postDetail}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID
  };
}

export default connect(mapStateToProps)(PostDetail)