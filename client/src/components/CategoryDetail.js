import React, { Component } from 'react'
import { getCategoryByID } from '../utils/index'
import PostSummary from './PostSummary';

export default class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null
    };
  }

  async componentDidMount() {
    const { categoryID } = this.props.match.params;
    let category = await getCategoryByID(categoryID);
    this.setState({
      category
    });
  }

  render() {
    const { category } = this.state;
    if(!category) {
      return (
        <div>
          Loading ...
        </div>
      );
    }
    return (
      <div>
        <h2>Category: {category.name}</h2>
        {
          category.posts.map((post, index) => {
            return <PostSummary post={post} key={index}></PostSummary>
          })
        }
      </div>
    )
  }
}
