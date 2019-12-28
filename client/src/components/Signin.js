import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import CustomInput from './CustomInput';
import * as actions from '../actions';

class Signin extends Component {
  onSubmit = async (formData) => {
    await this.props.signIn(formData);

    if(this.props.errorMsg === '') {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (

      <div className="col-lg-6">
        <form className="mt-3" onSubmit={handleSubmit(this.onSubmit)}>
          <Field 
          id="email"
          name="email"
          label="Email"
          type="email"
          component={ CustomInput }
          />

          <Field 
          id="password"
          name="password"
          label="Password"
          type="password"
          component={ CustomInput }
          />
 

          <button type="submit" className="btn bg-primary text-white mt-2 mr-2" disabled={pristine || submitting} >Sign In</button>        
          <button type="button" className="btn bg-primary text-white mt-2" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    errorMsg: state.user.errorMsg
  };
}

export default compose(
  reduxForm({ form: 'signin' }),
  connect(mapStateToProps, actions)
)(Signin);