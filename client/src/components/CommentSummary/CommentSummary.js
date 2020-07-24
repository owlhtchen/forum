import React, {Component} from 'react';
import ProfileDetailedSmall from "../ProfileSummary/ProfileDetailedSmall";
import TagBar from "../Tag/TagBar";
import {Link} from "react-router-dom";
import MarkdownView from "../MarkdownView/MarkdownView";
import {getPostTitleUrl} from "../../utils/post";
import './CommentSummary.scss';

class CommentSummary extends Component {

    render() {
        let { post, collapsed } = this.props;
        collapsed = (collapsed === undefined)? true: collapsed;
        let titleUrl = getPostTitleUrl(post);

        return (
            <div className="comment-summary">
                <div className="comment-summary__header">
                    <ProfileDetailedSmall user={post.author} />
                    <span>
                        {", commented on post "}
                        <Link to={titleUrl}>
                            {`${post.title}`}
                        </Link>
                    </span>
                </div>
                <div className="comment-summary__content">
                    <MarkdownView
                        collapsed={collapsed}
                        content={post.content}
                        disallowedTypes={['heading']}
                    />
                </div>
            </div>
        );
    }

}

export default CommentSummary;