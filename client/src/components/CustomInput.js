import React, { Component } from 'react'

export default class CustomInput extends Component {
  render() {
    // https://redux-form.com/8.1.0/docs/api/field.md/#props
    const {
      input: {value, onChange}
    } = this.props;

    return (
      <fieldset className="form-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input className="form-control"
        id={this.props.id}
        name={this.props.name}
        type={this.props.type}
        value={value}
        onChange={onChange}
        />
      </fieldset>
    )
  }
}
