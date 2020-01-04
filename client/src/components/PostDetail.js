import React, { Component } from 'react'
import { Link } from 'react-router-dom'
const ReactMarkdown = require('react-markdown');

export default class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessagePopup: false
    };
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
    function dateInfo(){
      return ' on '.concat(formatDate(new Date(Date.parse(createDate))));
    }
    const { title, createDate, content, author } = this.props.post;

    const postDetail = (
      <div className="post-detail">
       <h2>{ title }</h2>
        <div>
          <span>Posted by </span>
          <Link to={'/users/profile/' + author[0]._id}>{author[0].username}</Link>
          { dateInfo() }  
        </div>
        <button>Follow</button>
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