import React, {Component} from 'react';
import LoadingCircle from "../Loading/LoadingCircle";
import PostSummary from "../PostSummary/PostSummary";
import { connect } from 'react-redux';
import {getBookmarks} from "../../utils/user";
import {handleError} from "../../utils";
import './Bookmarks.scss';
import CommentSummary from "../CommentSummary/CommentSummary";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as DeleteSVG} from "../assets/delete.svg";
import { cancelFavoritePost } from '../../utils/user';
import PostCommentSummary from "../PostCommentSummary/PostCommentSummary";

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

    deleteBookmark = (postID, index) => {
        const { userID } = this.props;
        let { bookmarks: prev } = this.state;
        prev.splice(index, 1);
        this.setState({
            bookmarks: prev
        });
        cancelFavoritePost(userID, postID);
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
                    bookmarks.map((post, index) => {
                        return (
                            <div>
                                <PostCommentSummary post={post} />
                                <SVGIcon onClick={() => { this.deleteBookmark(post._id, index); } }>
                                    <DeleteSVG />
                                </SVGIcon>
                            </div>
                        )
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