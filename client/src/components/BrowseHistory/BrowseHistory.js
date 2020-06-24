import React, {Component} from 'react'
import {getBrowseHistory} from '../../utils/user'
import PostSummary from '../PostSummary/PostSummary'
import {connect} from 'react-redux';
import LoadingCircle from "../Loading/LoadingCircle";
import './BrowseHistory.scss';

class BrowseHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            browseHistory: null
        };
    }

    async componentDidMount() {
        const {userID} = this.props;
        const browseHistory = await getBrowseHistory(userID);
        this.setState({
            browseHistory: browseHistory.reverse()
        });
    }

    render() {
        const {browseHistory} = this.state;
        if(browseHistory === null) {
            return <LoadingCircle width={"15rem"} />
        }
        return (
            <div className="browse-history">
                <h1 className="browse-history__title">Recent Browse History</h1>
                {
                    browseHistory.map((post) => {
                        return <PostSummary
                            post={post}
                            key={post._id}
                        />
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