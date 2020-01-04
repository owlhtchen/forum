import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { dateInfo } from '../utils/index'
const ReactMarkdown = require('react-markdown');

export default class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessagePopup: false
    };
  }

  render() {
    const { title, createDate, content, author } = this.props.post;

    const postDetail = (
      <div className="post-detail">
       <h2>{ title }</h2>
        <div>
          <span>Posted by </span>
          <Link to={'/users/profile/' + author[0]._id}>{author[0].username}</Link>
          { dateInfo(createDate) }  
        </div>
        <button>Follow Post</button>
        <hr></hr>
        <ReactMarkdown 
        source={content}
        linkTarget="_blank"/>
         <hr></hr>
      </div>
    );

    return (
      <div>
        {postDetail}
      </div>
    );
  }
}