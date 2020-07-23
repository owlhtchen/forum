import React, {Component} from 'react';
import PostSummary from "../PostSummary/PostSummary";
import CommentSummary from "../CommentSummary/CommentSummary";

class PostCommentSummary extends Component {
    render() {
        const { post } = this.props;
        let summary;
        if(post.postType === "post") {
            summary =  (
                <PostSummary
                    post={post}
                    key={post._id}
                />
            );
        } else {
            summary = (
                <CommentSummary
                    post={post}
                    key={post._id}
                />
            );
        }
        return (
            <div>
                {summary}
            </div>
        );
    }
}

export default PostCommentSummary;