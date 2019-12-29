import React, { Component } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default class Post extends Component {

  handleChange = value => {
    this.setState({ mdeValue: value });
  };

  render() {
    return (
      <div className="mt-5">
        <SimpleMDE onChange={this.handleChange} />;
      </div>
    )
  }
}
