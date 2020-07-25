import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './TagSummary.scss'
import MarkdownView from "../MarkdownView/MarkdownView";

export default class TagSummary extends Component {
    render() {
        const { tag } = this.props;
        return (
            <div className="tag-summary">
                <div className="tag-summary__title">
                    <Link to={"/tags/tag-by-id/" + tag._id}  className="tag-summary__title">
                        # {tag.name}
                    </Link>
                </div>
                <div className="tag-summary__posts">
                    {
                        tag.posts.slice(0, 3).map(post => {
                            return (
                                <Link to={`/posts/expanded-post/${post._id}`}>
                                    <div className="tag-summary__preview">
                                        <p>{post.title}</p>
                                        <MarkdownView content={post.content} />
                                    </div>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        )
    }
}
