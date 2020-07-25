import React, {Component} from 'react'
import {deleteUserHistory, getBrowseHistory} from '../../utils/user'
import PostSummary from '../PostSummary/PostSummary'
import {connect} from 'react-redux';
import LoadingCircle from "../Loading/LoadingCircle";
import './BrowseHistory.scss';
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as DeleteSVG} from "../assets/delete.svg";

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

    deletePostHistory = (postID, index) => {
        const { userID } = this.props;
        const { browseHistory: prev } = this.state;
        prev.splice(index, 1);
        this.setState({
            browseHistory: prev
        })
        deleteUserHistory(userID, postID);
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
                    browseHistory.map((post, index) => {
                        if(!post) {
                            console.log(browseHistory);
                            return <div/>;
                        }
                        return (
                            <div>
                                <PostSummary
                                    post={post}
                                    key={post._id}
                                />
                                <SVGIcon onClick={() => this.deletePostHistory(post._id, index) }>
                                    <DeleteSVG />
                                </SVGIcon>
                            </div>
                        );
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