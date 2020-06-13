import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';

import CustomInput from './CustomInput';
import * as actions from '../actions';

class Signup extends Component {
    onSubmit = async (formData) => {
        // data: {email: "email@email.com", username: "user", password: "aaa", sex: "male"}
        await this.props.signUp(formData);

        if (this.props.errorMsg === '') {
            this.props.history.push('/dashboard');
        }
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props

        return (

            <div className="col-lg-6">
                <form className="mt-3" onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        component={CustomInput}
                    />

                    <Field
                        id="username"
                        name="username"
                        label="Username"
                        type="text"
                        component={CustomInput}
                    />

                    <Field
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        component={CustomInput}
                    />

                    <div>
                        <label>Gender</label>
                        <div>
                            <label><Field name="gender" component="input" type="radio" value="male"/> Male</label> <br/>
                            <label><Field name="gender" component="input" type="radio" value="female"/> Female</label>
                        </div>
                    </div>

                    <button type="submit" className="btn bg-primary text-white mt-2 mr-2"
                            disabled={pristine || submitting}>Sign Up
                    </button>
                    <button type="button" className="btn bg-primary text-white mt-2" disabled={pristine || submitting}
                            onClick={reset}>Clear Values
                    </button>
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
    reduxForm({form: 'signup'}),
    connect(mapStateToProps, actions)
)(Signup);