import React, { Component } from 'react'
import axios from 'axios';
const ReactMarkdown = require('react-markdown')

export default class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null
    }
  }

  render() {
    function formatDate(date) {
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
    
      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }
    function info(){
      return 'posted by '.concat(author[0].username, ' on '.concat(formatDate(new Date(Date.parse(createDate)))));
    }
    const { title, createDate, content, author, comments } = this.props.post;
    
    console.log("post");
    console.log(this.props.post);

    const postDetail = (
      <div className="post-detail">
       <h2>{ title }</h2>
        <p>{ info() }</p>
        <hr></hr>
        <ReactMarkdown 
        source={content}
        linkTarget="_blank"/>
        {comments.map((comment) => {
          return <PostDetail post={comment} />;
        })}
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
