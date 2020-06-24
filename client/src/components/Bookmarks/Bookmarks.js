import React, {Component} from 'react';
import LoadingCircle from "../Loading/LoadingCircle";
import PostSummary from "../PostSummary/PostSummary";
import { connect } from 'react-redux';
import {getBookmarks} from "../../utils/user";
import {handleError} from "../../utils";
import './Bookmarks.scss';
import CommentSummary from "../CommentSummary/CommentSummary";

class Bookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
          bookmarks: null
        };
    }

    async componentDidMount() {
        const { userID } = this.props;
        if(!userID) {
            return;
        }
        try {
            let bookmarks = await getBookmarks(userID);
            this.setState({
                bookmarks
            })
        } catch (e) {
            handleError(e);
        }
    }

    render() {
        const { bookmarks } = this.state;
        if(bookmarks === null) {
            return <LoadingCircle width={"14rem"} />;
        }
        return (
            <div className="bookmarks">
                <h1 className="bookmarks__title">Bookmarks</h1>
                {
                    bookmarks.map(post => {
                        if(post.postType === "post") {
                            return (
                                <PostSummary
                                    post={post}
                                    key={post._id}
                                />
                            );
                        } else {
                            return (
                              <CommentSummary
                                post={post}
                                key={post._id}
                              />
                            );
                        }
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(Bookmarks);