import React, { Component } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserByID, getUserFollowers, notifyFollowers, getPostFollowers, getParentPost, getPostByID } from '../utils/index';
import SearchCategory from './SearchCategory';
import MentionUser from './MentionUser';

const mdeID = "mdeID";

class PostCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mdeValue: localStorage.getItem(`smde_${mdeID}`) || '',
      showMentionUser: false,
      chosenUserID: null,
      chosenUsername: ''
    }
  }
  
  setUser = (userInfoString) => {
    console.log(userInfoString);
    let userInfo = JSON.parse(userInfoString);
    console.log(userInfo);
    this.setState({
      showMentionUser: false,
      chosenUserID: userInfo.userID,
      chosenUsername: userInfo.username
    })
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
      let category;
      if(this.props.parentID) {
        postType = "comment";
      } else {
        postType = document.getElementById('postType').value;
        title = document.getElementById('title').value;
        category = document.getElementById('category').value;
      }
      let res = await axios.post('http://localhost:5000/posts/make-post', {
        title: title,
        content: content,
        postType: postType,
        authorID: this.props.userID,
        parentID: this.props.parentID,
        category: category
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
      const postFollowers = await getPostFollowers(parentID);
      const parentPost = await getPostByID(parentID);
      const postMessage = parentPost.title + " has a follow up";
      await notifyFollowers(postFollowers, postMessage, parentID);

      document.getElementById("post-form").reset();
      this.setState({
        mdeValue: ""
      });
      localStorage.removeItem(`smde_${mdeID}`)
      // refresh page to see new post/comment
      window.location.reload();
    } catch(err) {
      console.log("axios post error in PostCreator");
      console.log(err.message);
    }
  }

  handleAt = async (instance, changeObj) => {
    console.log(changeObj);
    if(changeObj.origin === '+input') {
      if(changeObj.text[0].charAt(0) === '@') {
        console.log("detect @");
        this.setState({
          showMentionUser: true
        });
      }
    }
  }

  render() {
    const { showMentionUser } = this.state
    return (
          <form onSubmit={this.handleSubmit} id="post-form">
            <div className="row">
              <div className="col-6">
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
                { !this.props.parentID && 
                <fieldset >
                  <label htmlFor="category">Category</label>
                  <SearchCategory />
                </fieldset>
                }
              </div>
            </div>

            <div className="row">
              <div className="col-6">            
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
                }}
                events={{'change': this.handleAt}}
                />
                <input type="submit" className="btn btn-primary" />
              </div>
              <div className="col-3 wrap-text">
                {
                  showMentionUser &&
                  <MentionUser 
                  setUser={this.setUser}
                  id={"userID"} />
                }
              </div>
            </div>
          </form>
    )
  }
}

const mapStateToProps = (state) =>  {
  return {
    userID: state.user.userID
  }
}

export default connect(mapStateToProps, null)(PostCreator);