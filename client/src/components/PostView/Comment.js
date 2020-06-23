import React, {Component} from 'react';
import MarkdownView from "../MarkdownView/MarkdownView";
import PostBar from "./PostBar";
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import './Comment.scss';

class Comment extends Component {
    render() {
        const { post } = this.props;
        return (
            <div className="comment">
                <div className="comment__main">
                    <ProfileDetailedSmall user={post.author} />
                    <MarkdownView
                        collapsed={false}
                        content={post.content}
                        key={post._id}
                    />
                    <PostBar post={post}/>
                </div>
                <div className="comment__nested">
                    {
                        post.comments.map(comment => {
                            return <Comment
                                post={comment}
                                key={comment._id}
                                />;
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Comment;