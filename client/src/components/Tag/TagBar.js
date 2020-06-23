import React, {Component} from 'react';
import { ReactComponent as TagSVG} from "../assets/tag.svg";
import './TagBar.scss';

class TagBar extends Component {
    render() {
        const { tags } = this.props;
        return (
            <div className="tag-bar">
                <TagSVG />
                {
                    tags.map(tag => {
                        return (
                            <span
                            key={tag._id}
                            className="tag-bar__name"
                            >{tag.name}</span>
                        );
                    })
                }
            </div>
        );
    }
}

export default TagBar;