import React, {Component} from 'react';
import MarkdownEditor from "./MarkdownEditor";
import './PostCreator.scss';
import SimpleMDEReact from "react-simplemde-editor";

class PostCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <div className="post-creator">
                <form onSubmit={this.handleSubmit} className="post-form">
                    <div className="post-form__group">
                        <label htmlFor="title" className="post-form__label">Title</label>
                        <input type="text" id="title"/>
                    </div>
                    <div className="post-form__group">
                        <label htmlFor="tag" className="post-form__label">Tags</label>
                        <input type="text" id="tag"/>
                        <span>Add</span>
                    </div>
                    <MarkdownEditor/>
                </form>
            </div>
        );
    }
}

export default PostCreator;