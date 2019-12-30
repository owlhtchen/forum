import React, { Component } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios';
import { connect } from 'react-redux';

const mdeID = "mdeID";

class PostCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mdeValue: localStorage.getItem(`smde_${mdeID}`) || ''
    }
  }

  handleChange = value => {
    this.setState({ 
      mdeValue: value
    });
    
  };

  handleSubmit = async (e) => {
    try{
      e.preventDefault();
      const title = document.getElementById('title').value;
      const postType = document.getElementById('postType').value;
      await axios.post('http://localhost:5000/posts/make-post', {
        title: title,
        content: this.state.mdeValue,
        postType: postType,
        authorID: this.props.userID
      });
      document.getElementById("post-form").reset();
      this.setState({
        mdeValue: ""
      });
    } catch(err) {
      
    }
  }

  render() {
    return (
      <div className="mt-4 mb-4">
        <form onSubmit={this.handleSubmit} id="post-form">
          <fieldset>
            <label htmlFor="title" className="mr-3 mb-2 h3">Title</label>
            <input type="text" id="title" className="h3"></input>
          </fieldset>
          <fieldset className="mb-2">
            <select name="postType" id="postType" className="form-control">
              <option>-- select a type --</option>
              <option value="post">PostCreator</option>
              <option value="comment">Comment</option>
              <option value="timeline">Timeline</option>
              <option value="column">Column</option>
            </select>
          </fieldset>
          <SimpleMDE id={mdeID}
          value={ this.state.mdeValue } 
          onChange={this.handleChange} 
          options = {{
            spellChecker: false,
            autosave: {
              enabled: true, 
              uniqueId: mdeID,
              delay: 1000
            }
          }} />
          <input type="submit" className="btn btn-primary" />
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

export default connect(mapStateToProps, null)(PostCreator);