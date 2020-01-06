import React, { Component } from 'react'
import axios from 'axios'

export default class SearchCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
  }

  async componentDidMount() {
    try {
      let res = await axios.get('/categories/all-categories');
      this.setState({
        categories: res.data
      });      
    } catch(err) {
      console.log(err.message);
    }
  }

  render() {
    const { categories } = this.state;
    return (
      <div>
        <select size="10" id="parentCategory">
          {
            categories.map((category, index) => {
              return <option value={category._id} key={index}>{category.name}</option>
            })
          }
        </select>
      </div>
    )
  }
}
