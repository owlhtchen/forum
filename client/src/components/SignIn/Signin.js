import React, {Component} from 'react';
import {connect} from 'react-redux';
import GoogleLogin from 'react-google-login';

import * as actions from '../../actions';

class Signin extends Component {
    handleSubmit = async (formData) => {
        await this.props.signIn(formData);

        if (this.props.errorMsg === '') {
            this.props.history.push('/dashboard');
        }
    }

    responseGoogle = async (response) => {
        await this.props.googleOauth(response);

        if (this.props.errorMsg === '') {
            this.props.history.push('/homepage');
        }
    }

    render() {
        return (
            <div className="sign-div">
                <div className="form-div">
                    <form onChange={this.handleChange}
                          onSubmit={this.handleSubmit} className="sign-form">
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Email</label>
                            <input id="email" type="text" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Password</label>
                            <input id="username" type="text" className="sign-form__input" required/>
                        </div>
                        <button className="sign-form__btn">
                            Sign In &#8594;
                        </button>
                    </form>
                    <hr />
                    <h2>Or try three party sign in 👇</h2>
                    <GoogleLogin
                        className="google-btn"
                        clientId="48536141752-fhirsi9pum3iecolfrnnbbina2e45ia8.apps.googleusercontent.com"
                        buttonText="Google Login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMsg: state.user.errorMsg
    };
}

export default connect(mapStateToProps, actions)(Signin);