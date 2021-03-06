import React, {Component} from 'react';
import LoadingCircle from "../Loading/LoadingCircle";
import {getPostTitleUrl, viewPost} from "../../utils/post";
import {connect} from 'react-redux';
import ProfileDetailedSmall from "../ProfileSummary/ProfileDetailedSmall";
import {Link} from "react-router-dom";
import MarkdownView from "../MarkdownView/MarkdownView";
import './PostView.scss'
import PostBar from "./PostBar";
import Comment from './Comment';
import TagBar from "../Tag/TagBar";

class PostView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: null
        }
    }

    async componentDidMount() {
        let postID = this.props.match.params.postID;
        let { userID } = this.props;
        let post = await viewPost(postID, userID);
        this.setState({
            post
        });
        this.scrollToAnchorTag();
    }

    scrollToAnchorTag = () => {
        let { hash } = window.location;
        if(hash && hash.length > 0) {
            hash = hash.substring(1)
            let jumpToPost = document.getElementById(`${hash}`);
            if(hash !== this.state.post._id) {
                jumpToPost.style.border = "2px dashed #e879c1";
            }
            setTimeout(()=> {
                jumpToPost.scrollIntoView();
            }, 200);
        }
    }

    prependComment = (newComment) => {
        let prevPost = JSON.parse(JSON.stringify(this.state.post));
        prevPost.comments.unshift(newComment);
        this.setState({
            post: prevPost
        });
    }

    render() {
        const { post } = this.state;
        if(post === null) {
            return <LoadingCircle
                width="10rem"
                height="10rem"
            />
        }
        let titleUrl = getPostTitleUrl(post);
        let contentDiv;
        if(!post.isDeleted) {
            contentDiv = (
                <div>
                    <ProfileDetailedSmall user={post.author} />
                    { post.tags && post.tags.length > 0 && <TagBar tags={post.tags}/> }
                    <h1 className="post-view__title">
                        <Link to={titleUrl} >
                            {post.title}
                        </Link>
                    </h1>
                    <div className="post-view__content">
                        <MarkdownView
                            collapsed={false}
                            content={post.content}
                        />
                    </div>
                    <PostBar
                        post={post}
                        prependComment={this.prependComment}
                    />
                </div>
            );
        } else {
            contentDiv = (
              <div>
                  <h1 className="post-view__title">
                      <p>Deleted</p>
                  </h1>
                  <div className="post-view__content">
                      <MarkdownView
                          collapsed={false}
                          content={"deleted"}
                      />
                  </div>
              </div>
            );
        }
        return (
            <div className="post-view">
                <div className="post-view__main" id={post._id}>
                    {contentDiv}
                </div>
                <div className="post-view__comments">
                    {
                        post.comments.map(comment => {
                            return <Comment
                                post={comment}
                                key={comment._id}
                            />
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(PostView);