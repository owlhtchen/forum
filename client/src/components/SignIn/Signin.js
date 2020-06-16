import React, {Component} from 'react';
import {connect} from 'react-redux';
import GoogleLogin from 'react-google-login';

import * as actions from '../../actions';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    handleChange = () => {
        const email = document.querySelector("#sign-in-form #email").value;
        const password = document.querySelector("#sign-in-form #password").value;
        this.setState({
            email,
            password
        })
        // setTimeout(() => {console.log(this.state)}, 5000)
    }

    handleSubmit = async (e) => {
        // data: {email: "email@email.com", password: "aaa"}
        e.preventDefault();
        await this.props.signIn(this.state);

        if (this.props.errorMsg === '') {
            this.props.history.push('/users/profile/' + this.props.userID);
        } else {
            //TODO: make sign in, sign up error more beautiful
            alert("sign in failed: " + this.props.errorMsg);
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
            <div className="sign-div" id="sign-in-form">
                <div className="form-div">
                    <form onChange={this.handleChange}
                          onSubmit={this.handleSubmit} className="sign-form">
                        <div className="sign-form__group">
                            <label htmlFor="email" className="sign-form__label">Email</label>
                            <input id="email" type="email" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="password" className="sign-form__label">Password</label>
                            <input id="password" type="password" className="sign-form__input" required/>
                        </div>
                        <button className="sign-form__btn">
                            Sign In &#8594;
                        </button>
                    </form>
                    <hr />
                    <h2>Or try three party sign in <span role="img" aria-label="pointing down">👇</span></h2>
                    <div className="google-btn">
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID,
        errorMsg: state.user.errorMsg
    };
}

export default connect(mapStateToProps, actions)(Signin);