import React, { Component } from 'react'
import axios from 'axios'
import PostView from './PostView'

export default class PostLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post : null 
    };
  }

  getPostOnUrlChange = async () => {
    const { postID } = this.props.match.params;
    const res = await axios.get('/posts/view-post/' + postID);
    this.setState({
      post: res.data
    });
  }

  async componentDidMount() {
    try {
      await this.getPostOnUrlChange();
    } catch(err) {
      console.log("axios exception in PostDetail");   
    }
  } 

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.postID !== prevProps.match.params.postID) {
      await this.getPostOnUrlChange();
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
        <PostView post={this.state.post} />
      </div>
    )
  }
}
