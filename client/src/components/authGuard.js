import React, { Component } from 'react'
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
      return <OriginalComponent {...this.props} />
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