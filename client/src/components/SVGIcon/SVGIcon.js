import React, {Component} from 'react';
import './SVGIcon.scss';

class SVGIcon extends Component {
    showToolTip = (e) => {
        let toolTipSpan = e.currentTarget.querySelector(".post-icon__tooltip");
        if(toolTipSpan && (!toolTipSpan.style.display || toolTipSpan.style.display === "none") ){
            toolTipSpan.style.display = "inline-block";
        }
    }

    closeToolTip = (e) => {
        let toolTipSpan = e.currentTarget.querySelector(".post-icon__tooltip");
        if(toolTipSpan && (!toolTipSpan.style.display || toolTipSpan.style.display === "inline-block") ){
            toolTipSpan.style.display = "none";
        }
    }

    render() {

        let { text, tooltip, children, onClick, fill, width } = this.props;
        let style = {
            "fill": fill
        }
        if(width) {
            style["width"] = width;
            style["height"] = width;
        }

        return (
            <div className="post-icon" onClick={onClick}
                 onMouseOver={this.showToolTip}
                onMouseLeave={this.closeToolTip}
            >
                <div className="post-icon__main">
                    <div
                        className="post-icon__svg"
                        style={style}
                    >
                        {children}
                    </div>
                    {text &&
                    <span className="post-icon__text">{text}</span>
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

export default SVGIcon;