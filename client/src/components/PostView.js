import React, { Component } from 'react'
import axios from 'axios'
import PostDetail from './PostDetail'
import PostCreator from './PostCreator';
import { connect } from 'react-redux';

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddComment: false,
      upvoted: false
    }
  }

  addComment = () => {
    const { showAddComment } = this.state;
    this.setState({
      showAddComment: !showAddComment
    });
  }

  upvote = async () => {
    const prevUpvoted = this.state.upvoted;
    const body = {
      postID: this.props.post._id,
      userID: this.props.userID
    }
    this.setState({
      upvoted: !prevUpvoted
    });
    console.log(body);
    if(prevUpvoted) {
      await axios.post('/posts/cancelUpvote', body);
    } else {
      await axios.post('/posts/upvote', body);
    }
  }

  render() {   
    const { post } = this.props;
    const { upvoted } = this.state;
    return (
      <div className="container mb-3">
        <PostDetail post={post} />
        <button className="btn" onClick={this.addComment}>Reply</button>
        <button className={upvoted ? "btn btn-primary": "btn"} onClick={this.upvote}>Upvote</button>
        { this.state.showAddComment && <PostCreator parentID={post._id} /> }        
        <div>
          {
            post.comments.map((comment, index) => {
              return <PostView post={comment} key={index} />;
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userID: store.user.userID
  }
}

export default connect(mapStateToProps, null)(PostView);