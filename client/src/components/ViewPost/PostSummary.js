import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import PostBarIcon from "./PostBarIcon";
import './PostSummary.scss';
import PostBar from "./PostBar";

const ReactMarkdown = require('react-markdown/with-html');

export default class PostSummary extends Component {
    imageSize = (props) => {
        return <img {...props} style={{maxWidth: '50%'}} />
    }

    expandContent = (e) => {
        e.currentTarget.classList.remove("show-more");
        e.currentTarget.style.maxHeight = "none";
    }

    render() {
        const {post} = this.props;
        // console.log(post);  // TODO: DELETE
        return (
            <div className="post-summary">
                <ProfileDetailedSmall user={post.author} />
                <h1 className="post-summary__title">
                    <Link to={`/posts/expanded-post/${post._id}`} >
                        {post.title}
                    </Link>
                </h1>
                <div className="post-summary__content show-more"
                    onClick={this.expandContent}
                >
                    <ReactMarkdown
                        source={post.content}
                        escapeHtml={false}
                        disallowedTypes={['heading']}
                        unwrapDisallowed={true}
                        renderers={{image: this.imageSize}}
                    />
                </div>
                <div className="post-summary__bar">
                    <PostBar post={post} />
                </div>
            </div>
        )
    }
}
