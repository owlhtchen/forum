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
      let postType;
      if(this.props.parentPost) {
        postType = "comment";
      } else {
        postType = document.getElementById('postType').value;
      }
      await axios.post('http://localhost:5000/posts/make-post', {
        title: title,
        content: this.state.mdeValue,
        postType: postType,
        authorID: this.props.userID,
        parentPost: this.props.parentPost
      });
      document.getElementById("post-form").reset();
      this.setState({
        mdeValue: ""
      });
    } catch(err) {
      console.log("axios post error in PostCreator");
    }
  }

  render() {
    return (
      <div style={{ width: '50%' }}>
        <form onSubmit={this.handleSubmit} id="post-form">
          <fieldset className="form-control">
            <label htmlFor="title">Title&nbsp;</label>
            <input type="text" id="title"></input>
          </fieldset>
          { !this.props.parentPost && 
          <fieldset >
            <select name="postType" id="postType" className="form-control">
              <option>-- select a type --</option>
              <option value="post">Post</option>
              <option value="timeline">Timeline</option>
              <option value="column">Column</option>
            </select>
          </fieldset>
          }
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