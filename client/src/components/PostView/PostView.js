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

class PostView extends Component {
    // load all data

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
                    <PostBar post={post}/>
                </div>
                <div className="post-view__comments">
                    {
                        post.comments.map(comment => {
                            return <Comment post={comment}/>
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