import React, { Component } from 'react'
import axios from 'axios'
import SearchCategory from './SearchCategory';

export default class Category extends Component {
  addCategory = async () => {
    try {
      const name = document.getElementById('category').value;
      const parentID = document.getElementById('parentCategory').value;
      await axios.post('/categories/add-category', {
        name: name,
        parentID: parentID
      });      
    } catch(err) {
      console.log(err.message);
    }
  }

  render() {
    return (
      <form className="mt-3" onSubmit={this.addCategory}>
        <fieldset>
          <label htmlFor="category">Category&nbsp;</label>
          <input id="category"></input>
        </fieldset>
        <fieldset>
          <label htmlFor="parentCategory">Parent Category&nbsp;</label>
          <SearchCategory />
        </fieldset>
        <button>Add</button>
      </form>
    )
  }
}
