import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const authGuard = (OriginalComponent) => {
  class MixedComponent extends Component {
    unAuthedRedirect = () => {
      if(!this.props.isAuthed) {
        this.props.history.push('/');
      }
    }

    componentDidMount() {
      this.unAuthedRedirect();
    }

    componentDidUpdate() {
      this.unAuthedRedirect();
    }

    render() {
      if(this.props.isAuthed) {
        return <OriginalComponent {...this.props} />;
      } else {
        return <Redirect to="/" />
      }
    } 
  } 

  const mapStateToProps = (state) => {
    return {
      isAuthed: state.user.isAuthed
    }
  }
  
  return connect(mapStateToProps)(MixedComponent);
}



export default authGuard