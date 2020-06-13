import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class CategorySummary extends Component {
    render() {
        const {category} = this.props;
        return (
            <li className="list-group-item">
                <Link to={"/categories/category-by-id/" + category._id}>{category.name}</Link>
            </li>
        )
    }
}
