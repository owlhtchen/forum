import React, {Component} from 'react'
import * as actions from '../actions';
import {connect} from 'react-redux';

class Dashboard extends Component {
    async componentDidMount() {
        try {
            await this.props.getSecret();
        } catch (err) {
            console.log('error: axios in Dashboard mount');
        }
    }

    render() {
        return (
            <div>
                <h3 className="mt-3">Dashboard</h3>
                <p>{this.props.secret}</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        secret: state.dashboard.secret
    };
}

export default connect(mapStateToProps, actions)(Dashboard);