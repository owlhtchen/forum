import React, {Component} from 'react';
import MarkdownEditor from "./MarkdownEditor";

class PostCreator extends Component {
    render() {
        return (
            <div>
                <MarkdownEditor />
            </div>
        );
    }
}

export default PostCreator;