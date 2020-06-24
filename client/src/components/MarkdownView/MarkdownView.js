import React, {Component} from 'react';
import './MarkdownView.scss';

const ReactMarkdown = require('react-markdown/with-html');

class MarkdownView extends Component {
    imageSize = (props) => {
        return <img
                    {...props}
                    style={{maxWidth: '50%', display: "block", padding: "1rem 0"}}
                />
    }

    expandContent = (e) => {
        if(this.props.collapsed) {
            e.currentTarget.classList.remove("collapsed-md");
            e.currentTarget.classList.add("expanded-md");
            e.currentTarget.style.maxHeight = "none";
        }
    }

    render() {
        const { content, collapsed, disallowedTypes } = this.props;
        return (
            <div className={collapsed? "collapsed-md": "expanded-md"}
                 onClick={this.expandContent}
            >
                <ReactMarkdown
                    source={content}
                    escapeHtml={false}
                    disallowedTypes={disallowedTypes}
                    unwrapDisallowed={true}
                    renderers={{image: this.imageSize}}
                />
            </div>
        );
    }
}

export default MarkdownView;