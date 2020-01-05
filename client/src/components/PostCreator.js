import React, { Component } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserByID, getUserFollowers, notifyFollowers, getPostFollowers, getParentPost, getPostByID } from '../utils/index';

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
      let title;
      let postType;
      let content = this.state.mdeValue;
      if(this.props.parentID) {
        postType = "comment";
      } else {
        postType = document.getElementById('postType').value;
        title = document.getElementById('title').value;
      }
      let res = await axios.post('http://localhost:5000/posts/make-post', {
        title: title,
        content: content,
        postType: postType,
        authorID: this.props.userID,
        parentID: this.props.parentID
      });
      let newPostID = res.data;

      //notification
      const user = await getUserByID(this.props.userID);
      const userMessage = user.username + " made a " + postType + 
                  ((postType === "comment") ? ": " + content.slice(0, 7) + "(...)" : " with title: " + title);
      // user followers
      const userFollowers = await getUserFollowers(user._id);
      await notifyFollowers(userFollowers, userMessage, newPostID);
      // parent Post followers
      const parentID = await getParentPost(newPostID);
      // console.log("parent post id");
      // console.log(parentID);
      const postFollowers = await getPostFollowers(parentID);
      console.log("postFollowers");
      console.log(postFollowers);
      const parentPost = await getPostByID(parentID);
      // console.log(parentPost);
      const postMessage = parentPost.title + " has a follow up";
      await notifyFollowers(postFollowers, postMessage, parentID);

      document.getElementById("post-form").reset();
      this.setState({
        mdeValue: ""
      });
      // refresh page to see new post/comment
      window.location.reload();
    } catch(err) {
      console.log("axios post error in PostCreator");
      console.log(err.message);
    }
  }

  render() {
    return (
      <div style={{ width: '50%' }}>
        <form onSubmit={this.handleSubmit} id="post-form">
          { !this.props.parentID && 
            <fieldset className="form-control">
              <label htmlFor="title">Title&nbsp;</label>
              <input type="text" id="title"></input>
            </fieldset>
          }
          { !this.props.parentID && 
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