import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import './PostSummary.scss';
import MarkdownView from "../MarkdownView/MarkdownView";
import TagBar from "../Tag/TagBar";

export default class PostSummary extends Component {

    render() {
        let { post, collapsed } = this.props;
        collapsed = (collapsed === undefined)? true: collapsed;
        let isPostComment = (post.postType === "post-comment");
        let isSubComment = (post.postType === "sub-comment");
        let titleUrl = `/posts/expanded-post/${post._id}`;
        if (isPostComment) {
                titleUrl = `/posts/expanded-post/${post.parentID}`;
        } else if(isSubComment) {
            titleUrl = `/posts/expanded-post/${post.ancestorID}`;
        }
        // console.log(post);  // TODO: DELETE
        return (
            <div className="post-summary">
                <ProfileDetailedSmall user={post.author} />
                { post.tags.length !== 0 && <TagBar tags={post.tags} />}
                <h2 className="post-summary__title">
                    <Link to={titleUrl} >
                        {post.title}
                    </Link>
                </h2>
                <div className="post-summary__content">
                    <MarkdownView
                        collapsed={collapsed}
                        content={post.content}
                        disallowedTypes={['heading']}
                    />
                </div>
            </div>
        )
    }
}
