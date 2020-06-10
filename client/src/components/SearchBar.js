import React, { Component } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

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
    const { keyword } = this.state;
    return (
      <form className="form-inline m-2 my-lg-0">
        <input onChange={this.onChange} className="form-control mr-sm-2 btn-outline-success" type="search" placeholder="Search" aria-label="Search" />
        <NavLink className="btn btn-outline-success my-2 my-sm-0" type="submit"
        to={'/search/' + keyword}>Search</NavLink>
      </form>
    )
  }
}
