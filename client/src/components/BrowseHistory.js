import React, { Component } from 'react'
import { getBrowseHistory } from '../utils/index'
import PostSummary from './PostSummary'
import { connect } from 'react-redux';

class BrowseHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      browseHistory: []
    };
  }

  async componentDidMount () {
    const { userID } = this.props;
    const browseHistory = await getBrowseHistory(userID);
    this.setState({
      browseHistory: browseHistory.reverse()
    });
  }

  render() {
    const { browseHistory } = this.state;
    return (
      <div>
        <h4>Recent Browse History</h4>
        {
          browseHistory.map((post) => {
            return <PostSummary post={post} />
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(BrowseHistory);