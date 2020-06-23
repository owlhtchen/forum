import React, {Component} from 'react';
import Loading from "../Loading/Loading";
import {viewPost} from "../../utils/post";
import {connect} from 'react-redux';
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
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
            return <Loading
                width="10rem"
                height="10rem"
            />
        }
        console.log(post);
        let titleUrl = `/posts/expanded-post/${post._id}`;
        return (
            <div className="post-view">
                <div className="post-view__main">
                    <ProfileDetailedSmall user={post.author} />
                    <TagBar tags={post.tags}/>
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