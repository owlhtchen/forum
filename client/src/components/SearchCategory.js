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
    const { id } = this.props;
    try {
      let res = await axios.get('/categories/all-categories');
      this.setState({
        categories: res.data
      });    
      document.getElementById(id).size = res.data.length <= 8? res.data.length : 8;  
    } catch(err) {
      console.log(err.message);
    }
  }

  render() {
    const { categories } = this.state;
    const { id } = this.props;
    return (
      <div>
        <select id={id}>
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
