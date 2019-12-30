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
      return 'posted by '.concat(authorID.username, ' on '.concat(formatDate(new Date(Date.parse(createDate)))));
    }
    const { title, createDate, content, authorID } = this.state.post;
    return (
      <div className="post-detail">
       <h2>{ title }</h2>
        <p>{ info() }</p>
        <hr></hr>
        <ReactMarkdown 
        source={content}
        linkTarget="_blank"/>
         <hr></hr>
      </div>
    )
  }
}
