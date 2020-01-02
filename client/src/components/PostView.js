import React, { Component } from 'react'
import axios from 'axios'
import PostDetail from './PostDetail'
import PostCreator from './PostCreator';

export default class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddComment: false
    }
  }

  addComment = () => {
    const { showAddComment } = this.state;
    this.setState({
      showAddComment: !showAddComment
    });
  }

  render() {   
    const { post } = this.props;
    return (
      <div className="container mb-3">
        <PostDetail post={post} />
        <button onClick={this.addComment}>Reply</button>
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
