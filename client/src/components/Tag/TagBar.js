import React, {Component} from 'react';
import { ReactComponent as TagSVG} from "../assets/tag.svg";
import './TagBar.scss';
import {Link} from "react-router-dom";

class TagBar extends Component {
    render() {
        const { tags } = this.props;
        return (
            <div className="tag-bar">
                <TagSVG />
                {
                    tags.map(tag => {
                        return (
                            <Link
                                to={`/tags/tag-by-id/${tag._id}`}
                                key={tag._id}
                                className="tag-bar__name"
                            >
                                <span
                                >{tag.name}</span>
                            </Link>
                        );
                    })
                }
            </div>
        );
    }
}

export default TagBar;