import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class DeletePost extends Component {
  deletePost = async () => {
    const { post, userID } = this.props;
    await axios.post('/posts/delete-post', {
      post: post,
      userID: userID
    })
  }

  render() {
    const { isAdmin, userID, post } = this.props;
    const isAuthor = (post.authorID === userID);
    console.log("isAuthor");
    console.log(isAuthor);
    console.log("isAdmin");
    console.log(isAdmin);
    if(!isAuthor && !isAdmin) {
      return <span></span>;
    }
    return (
      <button onClick={this.deletePost} className="btn">Delete</button>      
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAdmin: state.user.isAdmin,
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(DeletePost);
