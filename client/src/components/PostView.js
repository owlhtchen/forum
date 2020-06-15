import React, {Component} from 'react'
import axios from 'axios'
import PostDetail from './PostDetail'
import PostCreator from './CreatePost/PostCreator';
import {connect} from 'react-redux';
import DeletePost from './DeletePost';
import QRDropdown from './QRDropdown';

class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddComment: false,
            upvoted: false
        }
    }

    async componentDidMount() {
        const body = {
            postID: this.props.post._id,
            userID: this.props.userID
        };
        const res = await axios.post('/posts/checkUpvote', body);
        this.setState({
            upvoted: res.data.upvoted
        })
    }

    addComment = () => {
        const {showAddComment} = this.state;
        this.setState({
            showAddComment: !showAddComment
        });
    }

    upvote = async () => {
        const prevUpvoted = this.state.upvoted;
        const body = {
            postID: this.props.post._id,
            userID: this.props.userID
        }
        this.setState({
            upvoted: !prevUpvoted
        });

        if (prevUpvoted) {
            await axios.post('/posts/cancelUpvote', body);
        } else {
            await axios.post('/posts/upvote', body);
        }
    }

    render() {
        const {post} = this.props;
        const {upvoted} = this.state;
        return (
            <div className="container mb-3">
                <PostDetail post={post}/>
                <button className="btn" onClick={this.addComment}>Reply</button>
                <QRDropdown post={post}></QRDropdown>
                <button className={upvoted ? "btn btn-primary" : "btn"} onClick={this.upvote}>Upvote</button>
                <DeletePost
                    post={post}></DeletePost>
                {this.state.showAddComment && <PostCreator postType="comment" parentID={post._id}/>}
                <div>
                    {
                        post.comments.map((comment, index) => {
                            return <PostView post={comment} key={index} userID={this.props.userID}/>;
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(PostView);