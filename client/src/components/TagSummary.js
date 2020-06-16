import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class TagSummary extends Component {
    render() {
        const {tag} = this.props;
        return (
            <li className="list-group-item">
                <Link to={"/tags/tag-by-id/" + tag._id}>{tag.name}</Link>
            </li>
        )
    }
}
