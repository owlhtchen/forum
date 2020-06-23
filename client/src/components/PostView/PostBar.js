import React, {Component} from 'react';
import PostBarIcon from "./PostBarIcon";
import {ReactComponent as UpvoteSVG} from "../assets/up.svg";
import {ReactComponent as DownvoteSVG} from "../assets/down.svg";
import {ReactComponent as CommentSVG} from "../assets/comment.svg";
import {ReactComponent as ReplySVG} from "../assets/reply.svg";
import {ReactComponent as BookmarkSVG} from "../assets/bookmark.svg";
import {ReactComponent as ShareSVG} from "../assets/share.svg";
import {connect} from "react-redux";
import {cancelUpVotePost, checkUpVoted, upVotePost} from "../../utils/post";
import './PostBar.scss';
import CommentCreator from "../CreatePost/CommentCreator";
import axios from 'axios';

let bodyStyle = getComputedStyle(document.body);
let barColor = bodyStyle.getPropertyValue("--post-bar-icon-color");
let barColorActive = bodyStyle.getPropertyValue("--post-bar-icon-color-active");

class PostBar extends Component {

    constructor(props) {
        super(props);
        const { post } = this.props;
        this.state = {
            upVoted: false,
            post: post,
            replyShown: false,
            commentsShown: false
        };
    }

    async componentDidMount() {
        const { userID } = this.props;
        const { post } = this.state;
        let upVoted = await checkUpVoted(userID, post._id);
        this.setState({
            upVoted,
        })
    }

    upVote =  async () => {
        const { userID } = this.props;
        let { upVoted, post } = this.state;
        if(!upVoted) {
            post = await upVotePost(userID, post._id, post);
        } else {
            post = await cancelUpVotePost(userID, post._id, post);
        }
        console.log("now: ", !upVoted);
        this.setState({
            upVoted: !upVoted,
            post
        });
    }

    showReply = () => {
        const { replyShown: prev} = this.state;
        this.setState({
            replyShown: !prev,
            commentsShown: false
        })
    }

    showComments = () => {
        const { commentsShown: prev } = this.state;
        this.setState({
            commentsShown: !prev,
            replyShown: false
        });
    }

    render() {
        const { upVoted, post, replyShown } = this.state;
        const { prependComment } = this.props;

        return (
            <div className="post-bar">
                <div className="post-bar__icons">
                    <PostBarIcon
                        text={`${post.likedBy.length}`}
                        tooltip={"up vote"}
                        onClick={this.upVote}
                        fill={upVoted? barColorActive : barColor}
                    >
                        <UpvoteSVG />
                    </PostBarIcon>
                    <PostBarIcon
                        text={`${post.commentIDs.length}`}
                        onClick={this.showComments}
                    >
                        <CommentSVG />
                    </PostBarIcon>
                    <PostBarIcon
                        text={"Reply"}
                        onClick={this.showReply}
                    >
                        <ReplySVG />
                    </PostBarIcon>
                    <PostBarIcon
                        text={"Favorite"}
                    >
                        <BookmarkSVG />
                    </PostBarIcon>
                    <PostBarIcon>
                        <ShareSVG />
                    </PostBarIcon>
                </div>
                <div className="post-bar__reply">
                    {
                        replyShown &&
                        <CommentCreator
                            parentPost={post}
                            prependComment={prependComment}
                        />
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

export default connect(mapStateToProps)(PostBar);