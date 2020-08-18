import React, {Component} from 'react';
import SVGIcon from "../SVGIcon/SVGIcon";
import {ReactComponent as UpvoteSVG} from "../assets/up.svg";
import {ReactComponent as TrashSVG} from "../assets/trash.svg";
import {ReactComponent as CommentSVG} from "../assets/comment.svg";
import {ReactComponent as ReplySVG} from "../assets/reply.svg";
import {ReactComponent as BookmarkSVG} from "../assets/bookmark.svg";
import {ReactComponent as ShareSVG} from "../assets/share.svg";
import {ReactComponent as LinkSVG} from "../assets/link.svg";
import {ReactComponent as MoreSVG} from "../assets/more.svg";
import {connect} from "react-redux";
import {cancelUpVotePost, checkUpVoted, upVotePost} from "../../utils/post";
import './PostBar.scss';
import CommentCreator from "../CreatePost/CommentCreator";
import { handleError } from "../../utils/index";
import { deletePost } from "../../utils/post";
import MorePopup from "./MorePopup";

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
            morePopUpShown: false,
            linkShown: false
        };
    }

    async componentDidMount() {
        const { userID } = this.props;
        const { post } = this.state;
        let upVoted = await checkUpVoted(userID, post._id);
        this.setState({
            upVoted
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

    toggleReply = () => {
        const { replyShown: prev} = this.state;
        this.setState({
            replyShown: !prev,
        })
    }

    showMorePopUp = () => {
        let prev = this.state.morePopUpShown;
        this.setState({
            morePopUpShown: !prev
        });
    }

    deletePost = async () => {
        const { post } = this.state;
        const { userID } = this.props;
        await deletePost(post._id, userID);
        window.location.reload();
        let deleted = document.getElementById(`${post._id.toString()}`);
        console.log(deleted)
        if(deleted) {
            setTimeout(() => {
                deleted.scrollIntoView();
            }, 2000);
        }
    }

    showCopiedLink = (e) => {
        const { linkShown : prev } = this.state;
        let linkDiv = e.currentTarget.parentNode.querySelector(".post-bar__link")
        this.setState({
            linkShown: !prev
        })
        if(prev === true) {
            linkDiv.style.display = "none";
        } else {
            linkDiv.style.display = "flex";
        }
        let linkInput = linkDiv.querySelector("input");
        linkInput.select();
        document.execCommand("copy");
    }

    render() {
        const { upVoted, post, replyShown, morePopUpShown, linkShown } = this.state;
        const { prependComment, userID } = this.props;

        let copiedUrl = window.location.hostname;
        if(window.location.port) {
            copiedUrl += `:${window.location.port}`
        }
        copiedUrl += `/posts/expanded-post/${post.ancestorID}#${post._id}`;

        return (
            <div className="post-bar">
                <div className="post-bar__icons">
                    <SVGIcon
                        text={`${post.likedBy.length}`}
                        tooltip={"up vote"}
                        onClick={this.upVote}
                        fill={upVoted? barColorActive : barColor}
                    >
                        <UpvoteSVG />
                    </SVGIcon>

                    <SVGIcon
                        text={`${post.commentIDs.length}`}
                    >
                        <CommentSVG />
                    </SVGIcon>

                    <SVGIcon
                        text={"Reply"}
                        onClick={this.toggleReply}
                    >
                        <ReplySVG />
                    </SVGIcon>

                    <div className="post-bar__link-div">
                        <SVGIcon
                            tooltip={"copy link to clipboard"}
                            onClick={this.showCopiedLink}>
                            <LinkSVG />
                        </SVGIcon>
                        <div className='post-bar__link'>
                            <label>(Copied)</label>
                            <input defaultValue={`${copiedUrl}`} size="50"/>
                        </div>
                    </div>

                    {
                        post.authorID === userID &&
                        <SVGIcon onClick={this.deletePost}>
                            <TrashSVG />
                        </SVGIcon>
                    }

                    <div className="post-bar__more">
                        {
                            morePopUpShown &&
                            <MorePopup post={post}/>
                        }
                        <SVGIcon
                            onClick={this.showMorePopUp}
                        >
                            <MoreSVG />
                        </SVGIcon>
                    </div>
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