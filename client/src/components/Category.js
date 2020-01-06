import React, { Component } from 'react'
import axios from 'axios'
import SearchCategory from './SearchCategory';

export default class Category extends Component {

  render() {
    return (
      <form className="mt-3">
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
