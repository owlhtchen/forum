import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import './PostSummary.scss';
import MarkdownView from "../MarkdownView/MarkdownView";

export default class PostSummary extends Component {

    render() {
        const { post, collapsed } = this.props;
        let isPostComment = (post.postType === "post-comment");
        let titleUrl = `/posts/expanded-post/${post._id}`;
        if (isPostComment) {
                titleUrl = `/posts/expanded-post/${post.parentID}`;
        }
        // console.log(post);  // TODO: DELETE
        return (
            <div className="post-summary">
                <ProfileDetailedSmall user={post.author} />
                <h1 className="post-summary__title">
                    <Link to={titleUrl} >
                        {post.title}
                    </Link>
                </h1>
                {
                    isPostComment &&   // TODO: show question detail?
                    <div className="post-summary__content">
                        <MarkdownView
                            collapsed={true}
                            content={post.content}
                            disallowedTypes={['heading']}
                        />
                    </div>
                }
            </div>
        )
    }
}
