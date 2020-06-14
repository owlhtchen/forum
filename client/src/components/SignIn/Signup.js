import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../actions';
import './Sign.scss';

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: ""
        };
    }

    handleChange = () => {
        const username = document.querySelector("#sign-up-form #username").value;
        const email = document.querySelector("#sign-up-form #email").value;
        const password = document.querySelector("#sign-up-form #password").value;
        this.setState({
            username,
            email,
            password
        })
        // setTimeout(() => {console.log(this.state)}, 5000)
    }

    handleSubmit = async () => {
        // data: {email: "email@email.com", username: "user", password: "aaa"}
        await this.props.signUp(this.state);

        if (this.props.errorMsg === '') {
            this.props.history.push('/profile');
        }
    }

    render() {
        return (
            <div className="sign-div" id="sign-up-form">
                <div className="form-div">
                    <form onChange={this.handleChange}
                          onSubmit={this.handleSubmit} className="sign-form">
                        <div className="sign-form__group">
                            <label htmlFor="username" className="sign-form__label">Username</label>
                            <input id="username" type="text" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="email" className="sign-form__label">Email</label>
                            <input id="email" type="email" className="sign-form__input" required/>
                        </div>
                        <div className="sign-form__group">
                            <label htmlFor="password" className="sign-form__label">Password</label>
                            <input id="password" type="password" className="sign-form__input" required/>
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