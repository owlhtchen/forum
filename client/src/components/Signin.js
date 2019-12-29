import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

import CustomInput from './CustomInput';
import * as actions from '../actions';

class Signin extends Component {
  onSubmit = async (formData) => {
    await this.props.signIn(formData);

    if(this.props.errorMsg === '') {
      this.props.history.push('/dashboard');
    }
  }

  responseGoogle = async (response) => {
    console.log(response);
    await this.props.googleOauth(response);

    if(this.props.errorMsg === '') {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, errorMsg } = this.props

    return (
      <div>
        <div className="row">
          <div className="col-lg-6 mt-3">
            { errorMsg !== "" && 
              <div className="alert alert-danger">
                { errorMsg }
              </div> 
            }
            <form onSubmit={handleSubmit(this.onSubmit)}>
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
        </div>
        <div className="row">
          <div className="col-lg-6 mt-4">
            <div className="h5 text-dark">
              Third party login
            </div>
            <GoogleLogin
              clientId="48536141752-fhirsi9pum3iecolfrnnbbina2e45ia8.apps.googleusercontent.com"
              buttonText="Google Login"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={'single_host_origin'}
            /> 
          </div>       
        </div>
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