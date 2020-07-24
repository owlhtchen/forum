import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import { ReactComponent as SearchSVG } from '../assets/search.svg';
import { withRouter } from "react-router";

class SearchBar extends Component {
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

    handleSubmit = (e) => {
        e.preventDefault();
        const { keyword } = this.state;
        if(!keyword) {
            return;
        }
        this.props.history.push(`/search/${keyword}`);
    }

    render() {
        const {keyword} = this.state;
        return (
            <form className="header__search-form" onSubmit={this.handleSubmit}>
                <input className="header__search-input"
                    onChange={this.onChange} type="search" placeholder="Keyword" aria-label="Search"/>
                <NavLink
                    to={'/search/' + keyword} type="submit">
                    <SearchSVG onClick={this.handleClick} className="header__search-icon"/>
                </NavLink>
            </form>
        )
    }
}

export default withRouter(SearchBar);
