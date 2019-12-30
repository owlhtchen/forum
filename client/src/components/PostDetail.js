import React, { Component } from 'react'
import axios from 'axios'
const ReactMarkdown = require('react-markdown')

export default class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null 
    }
  }

  async componentDidMount() {
      const { postID } = this.props.match.params;
      const res = await axios.get('/posts/view-post/' + postID);
      this.setState({
        post: res.data
      });
  }

  render() {
    if(!this.state.post) {
      return (
        <div>
          Loading ... 
        </div>
      );
    }
    const { title, createDate, content, authorID } = this.state.post;
    return (
      <div>
        <h2>{ title }</h2>
        <p>{ createDate }</p>
        <ReactMarkdown source={content}/>
      </div>
    )
  }
}
