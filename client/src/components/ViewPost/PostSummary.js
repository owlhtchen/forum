import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import PostBarIcon from "./PostBarIcon";
import './PostSummary.scss';
import {ReactComponent as UpvoteSVG} from "../assets/up.svg";
import {ReactComponent as DownvoteSVG} from "../assets/down.svg";
import {ReactComponent as CommentSVG} from "../assets/comment.svg";
import {ReactComponent as BookmarkSVG} from "../assets/bookmark.svg";
import {ReactComponent as ShareSVG} from "../assets/share.svg";
const ReactMarkdown = require('react-markdown/with-html');

export default class PostSummary extends Component {
    imageSize = (props) => {
        return <img {...props} style={{maxWidth: '50%'}} />
    }

    render() {
        const {post} = this.props;
        // console.log(post);
        return (
            <div className="post-summary">
                <ProfileDetailedSmall user={post.author} />
                <h1 className="post-summary__title">
                    <Link to={`/posts/view-post/${post._id}`} >
                        {post.title}
                    </Link>
                </h1>
                <div className="post-summary__content">
                    <ReactMarkdown
                        source={post.content}
                        escapeHtml={false}
                        disallowedTypes={['heading']}
                        unwrapDisallowed={true}
                        renderers={{image: this.imageSize}}
                    />
                </div>
                <div className="post-summary__bar">
                    <PostBarIcon>
                        <UpvoteSVG />
                    </PostBarIcon>
                    <PostBarIcon>
                        <DownvoteSVG />
                    </PostBarIcon>
                    <PostBarIcon>
                        <CommentSVG />
                    </PostBarIcon>
                    <PostBarIcon>
                        <BookmarkSVG />
                    </PostBarIcon>
                    <PostBarIcon>
                        <ShareSVG />
                    </PostBarIcon>
                </div>
            </div>
        )
    }
}
