import React, { Component } from 'react'
import Axios from 'axios';

export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: []
    };
  }

  async componentDidMount() {
    const { keyword } = this.props.match.params;
    console.log(keyword)
    let res = await Axios.get('/search/' + keyword);
    console.log(res.data);
  }

  async componentDidUpdate(prevProps) {
    const { keyword } = this.props.match.params;
    if(keyword != prevProps.match.params.keyword) {
      console.log(keyword)
      let res = await Axios.get('/search/' + keyword);
      console.log(res.data);
    }
  }

  render() {
    return (
      <div>
        Search Result here
      </div>
    )
  }
}
