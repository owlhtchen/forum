import React, {Component} from 'react';
import './PostBarIcon.scss';

class PostBarIcon extends Component {
    render() {

        let { text, tooltip, children, onClick} = this.props;

        return (
            <div className="post-icon" onClick={onClick}>
                <div className="post-icon__main">
                    {children}
                    {text &&
                    <span>{text}</span>
                    }
                </div>
                {tooltip &&
                <div className="post-icon__tooltip">
                    <span>{tooltip}</span>
                </div>
                }
            </div>
        );
    }
}

export default PostBarIcon;