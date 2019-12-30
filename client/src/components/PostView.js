import React, { Component } from 'react'
import axios from 'axios'
import PostDetail from './PostDetail'

export default class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null 
    }
  }

  async componentDidMount() {
    try {
      const { postID } = this.props.match.params;
      const res = await axios.get('/posts/view-post/' + postID);
      this.setState({
        post: res.data
      });
    } catch(err) {
      console.log("axios exception in PostDetail");   
    }
  }

  render() {
    if(!this.state.post) {
      return (
        <div>
          Loading ... 
        </div>
      );
    }    
    return (
      <div>
        <PostDetail post={this.state.post} />
      </div>
    )
  }
}
