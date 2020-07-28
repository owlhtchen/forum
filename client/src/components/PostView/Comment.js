import React, {Component} from 'react';
import MarkdownView from "../MarkdownView/MarkdownView";
import PostBar from "./PostBar";
import ProfileDetailedSmall from "../ProfileSummary/ProfileDetailedSmall";
import './Comment.scss';

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post
        };
    }


    prependComment = (newComment) => {
        let prevPost = JSON.parse(JSON.stringify(this.state.post));
        // console.log("prependComment: ");   // TODO: DELETE
        // console.log(newComment);
        prevPost.comments.unshift(newComment);
        this.setState({
            post: prevPost
        });
    }

    render() {
        const { post } = this.state;
        let contentDiv;
        if(!post.isDeleted) {
            contentDiv = (
                <div>
                    <ProfileDetailedSmall user={post.author} />
                    <MarkdownView
                        collapsed={false}
                        content={post.content}
                        key={post._id}
                    />
                    <PostBar
                        post={post}
                        prependComment={this.prependComment}
                    />
                </div>
            )
        } else {
            contentDiv = (
                <div>
                    Deleted
                </div>
            );
        }
        return (
            <div className="comment" id={post._id}>
                <div className="comment__main">
                    {contentDiv}
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