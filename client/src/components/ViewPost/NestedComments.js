import React, {Component} from 'react';
import './NestedComments.scss';
import {getPostByID} from "../../utils/post";
import MarkdownView from "./MarkdownView";

class NestedComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }
    }

    async componentDidMount() {
        let { parentPost } = this.props;
        try {
            parentPost = await getPostByID(parentPost._id, 3);
            // if(parentPost.title === "here") {
                console.log(parentPost)
            // }
            this.setState({
                comments: parentPost.comments
            });

        } catch (e) {
            console.log("fetch nested comments failed");
        }
    }

    render() {
        const { comments } = this.state;
        return (
            <div className="nested-comments">
                {
                    comments.map(comment => {
                        return (
                            <MarkdownView
                            collapsed={false}
                            content={comment.content}
                            key={comment._id}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default NestedComments;