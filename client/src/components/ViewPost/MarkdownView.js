import React, {Component} from 'react';
import './MarkdownView.scss';

const ReactMarkdown = require('react-markdown/with-html');

class MarkdownView extends Component {
    imageSize = (props) => {
        return <img {...props} style={{maxWidth: '50%'}} />
    }

    expandContent = (e) => {
        e.currentTarget.classList.remove("collapsed-md");
        e.currentTarget.classList.add("expanded-md");
        e.currentTarget.style.maxHeight = "none";
    }

    render() {
        const { content } = this.props;
        return (
            <div className="collapsed-md"
                 onClick={this.expandContent}
            >
                <ReactMarkdown
                    source={content}
                    escapeHtml={false}
                    disallowedTypes={['heading']}
                    unwrapDisallowed={true}
                    renderers={{image: this.imageSize}}
                />
            </div>
        );
    }
}

export default MarkdownView;