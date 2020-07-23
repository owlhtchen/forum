import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../ProfileSmall/ProfileDetailedSmall";
import './PostSummary.scss';
import MarkdownView from "../MarkdownView/MarkdownView";
import TagBar from "../Tag/TagBar";
import {getPostTitleUrl} from "../../utils/post";

export default class PostSummary extends Component {

    render() {
        let { post, collapsed } = this.props;
        collapsed = (collapsed === undefined)? true: collapsed;
        let titleUrl = getPostTitleUrl(post);

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
        );
    }
}
