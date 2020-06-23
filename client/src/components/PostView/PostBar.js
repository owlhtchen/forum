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
import {cancelFavoritePost, checkFavorite, favoritePost} from "../../utils/user";
import { handleError } from "../utils/index";

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
            favorite: false
        };
    }

    async componentDidMount() {
        const { userID } = this.props;
        const { post } = this.state;
        if(!userID) {
            return;
        }
        let upVoted = await checkUpVoted(userID, post._id);
        let favorite = await checkFavorite(userID, post._id);
        this.setState({
            upVoted,
            favorite
        });
    }

    upVote =  async () => {
        const { userID } = this.props;
        let { upVoted, post } = this.state;
        try {
            if(!upVoted) {
                post = await upVotePost(userID, post._id, post);
            } else {
                post = await cancelUpVotePost(userID, post._id, post);
            }
            this.setState({
                upVoted: !upVoted,
                post
            });
        } catch (e) {
            handleError(e);
        }
    }

    favorite = async () => {
        const { userID } = this.props;
        if(!userID) {
            return;
        }
        let { favorite, post } = this.state;
        try {
            if(!favorite) {
                await favoritePost(userID, post._id);
            } else {
                await cancelFavoritePost(userID, post._id);
            }
            this.setState({
                favorite: !favorite
            })
        } catch (e) {
            handleError(e);
        }

    }

    toggleReply = () => {
        const { replyShown: prev} = this.state;
        this.setState({
            replyShown: !prev,
        })
    }

    render() {
        const { upVoted, post, replyShown, favorite } = this.state;
        const { prependComment } = this.props;
        console.log("render ", favorite);

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
                    >
                        <CommentSVG />
                    </PostBarIcon>
                    <PostBarIcon
                        text={"Reply"}
                        onClick={this.toggleReply}
                    >
                        <ReplySVG />
                    </PostBarIcon>
                    <PostBarIcon
                        text={"Favorite"}
                        tooltip="add to favorite"
                        onClick={this.favorite}
                        fill={favorite? barColorActive : barColor}
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
                            toggleReply={this.toggleReply}
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