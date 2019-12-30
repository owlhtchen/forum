import React, { Component } from 'react'
import axios from 'axios'
const ReactMarkdown = require('react-markdown')

export default class PostDetail extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      post: null 
    }
  }

  componentWillUnmount() {
    this.signal.cancel('Axios is being canceled');
  } 

  async componentDidMount() {
    try {
      const { postID } = this.props.match.params;
      const res = await axios.get('/posts/view-post/' + postID, {
        cancelToken: this.signal.token,
      });
      this.setState({
        post: res.data
      });
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log(err.message); // => prints: Api is being canceled
      }    
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
    const { title, createDate, content, authorID } = this.state.post;
    return (
      <div>
        <h2>{ title }</h2>
        <p>{ createDate }</p>
        <p>{ authorID.username }</p>
        <ReactMarkdown 
        source={content}
        linkTarget="_blank"/>
      </div>
    )
  }
}
