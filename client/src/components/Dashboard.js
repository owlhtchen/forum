import React, { Component } from 'react'
import * as actions from '../actions/user';
import { connect } from 'react-redux';

class Dashboard extends Component {
  async componentWillMount() {
    await this.props.getSecret();
  }

  render() {
    return (
      <div>
        <h3>dashboard</h3>
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