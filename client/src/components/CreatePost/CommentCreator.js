import React, {Component} from 'react';
import MarkdownEditor from "../CreatePost/MarkdownEditor";
import './CommentCreator.scss';
import { connect } from 'react-redux';
import {addComment} from "../../utils/post";

class CommentCreator extends Component {
    constructor(props) {
        // props: parentPost (prependComment)
        super(props);
        this.state = {
            mdeValue: "",
            parentPost: this.props.parentPost
        }
    }

    setMdeValue = (mdeValue) => {
        this.setState({
            mdeValue: mdeValue
        });
    }

    reset = () => {
        const { parentPost } = this.state;
        this.setState({
            mdeValue: ""
        })
        let uniqueId = "mde-editor-storage" + "${parentPost._id}";
        localStorage.setItem(`smde_${uniqueId}`, '');
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { mdeValue, parentPost } = this.state;
        const { userID, prependComment } = this.props;
        let postType;
        if(parentPost.postType === "post") {
            postType = "post-comment";
        } else { // parent is story, post-comment or sub-comment
            postType = "sub-comment";
        }
        let authorID = userID;
        let content = mdeValue;
        let newComment = await addComment(postType, authorID, content, parentPost);
        if(prependComment) {
            prependComment(newComment);
        }
        // this.reset();
    }

    render() {
        const { mdeValue, parentPost } = this.state;
        return (
            <div className="comment-creator">
                <form
                    className="comment-form"
                    onSubmit={this.handleSubmit}
                >
                    <MarkdownEditor
                        mdeValue={mdeValue}
                        setMdeValue={this.setMdeValue}
                        idSuffix={parentPost._id}
                    />
                    <button className="comment-form__btn" type="submit">Submit</button>
                    <button className="comment-form__btn" onClick={this.reset}>Reset</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(CommentCreator);