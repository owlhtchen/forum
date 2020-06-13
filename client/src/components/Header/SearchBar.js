import React, {Component} from 'react'
import axios from 'axios'
import {NavLink} from 'react-router-dom'
import { ReactComponent as SearchSVG } from '../assets/search.svg';

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ""
        }
    }

    onChange = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }

    render() {
        const {keyword} = this.state;
        return (
            <form className="header__search-form">
                <input className="header__search-input"
                    onChange={this.onChange} type="search" placeholder="Keyword" aria-label="Search"/>
                <NavLink
                    to={'/search/' + keyword} type="submit">
                    <SearchSVG className="header__search-icon"/>
                </NavLink>
            </form>
        )
    }
}
