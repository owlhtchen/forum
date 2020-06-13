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
          <div>

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