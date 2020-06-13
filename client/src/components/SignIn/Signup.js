import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../actions';
import './Sign.scss';

class Signup extends Component {
    handleSubmit = async (formData) => {
        // data: {email: "email@email.com", username: "user", password: "aaa"}
        await this.props.signUp(formData);

        if (this.props.errorMsg === '') {
            this.props.history.push('/profile');
        }
    }

    render() {
        return (
            <div className="sign-div">
                <div className="form-div">
                    <form onChange={this.handleChange}
                          onSubmit={this.handleSubmit} className="sign-form">
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Username</label>
                            <input id="username" type="text" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Email</label>
                            <input id="email" type="text" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Password</label>
                            <input id="username" type="text" className="sign-form__input" required/>
                        </div>
                        <button className="sign-form__btn">
                            Sign Up &#8594;
                        </button>
                    </form>
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

export default connect(mapStateToProps, actions)(Signup);