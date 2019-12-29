import React, { Component } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios';
import { connect } from 'react-redux';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mdeValue: ''
    }
  }

  handleChange = value => {
    this.setState({ 
      mdeValue: value
    });
    
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const postType = document.getElementById('postType').value;
    axios.post('http://localhost:5000/posts/makepost', {
      title: title,
      content: this.state.mdeValue,
      postType: postType,
      authorID: this.props.userID
    })
  }

  render() {
    return (
      <div className="mt-4 mb-4">
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <label htmlFor="title" className="mr-3 mb-2 h3">Title</label>
            <input type="text" id="title" className="h3"></input>
          </fieldset>
          <fieldset className="mb-2">
            <select name="postType" id="postType" className="form-control">
              <option value="post">Post</option>
              <option value="comment">Comment</option>
              <option value="timeline">Timeline</option>
              <option value="column">Column</option>
            </select>
          </fieldset>
          <SimpleMDE onChange={this.handleChange} />
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) =>  {
  return {
    userID: state.user.userID
  }
}

export default connect(mapStateToProps, null)(Post);