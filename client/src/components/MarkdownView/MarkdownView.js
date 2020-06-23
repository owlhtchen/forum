import React, {Component} from 'react';
import './MarkdownView.scss';

const ReactMarkdown = require('react-markdown/with-html');

class MarkdownView extends Component {
    imageSize = (props) => {
        return <img {...props} style={{maxWidth: '50%'}} />
    }

    expandContent = (e) => {
        if(this.props.collapsed) {
            e.currentTarget.classList.remove("collapsed-md");
            e.currentTarget.classList.add("expanded-md");
            e.currentTarget.style.maxHeight = "none";
        }
    }

    render() {
        const { content, collapsed } = this.props;
        return (
            <div className={collapsed? "collapsed-md": "expanded-md"}
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