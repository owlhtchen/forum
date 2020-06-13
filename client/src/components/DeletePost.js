import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

class DeletePost extends Component {
    deletePost = async () => {
        try {
            const {post, userID} = this.props;
            await axios.post('/posts/delete-post', {
                post: post,
                userID: userID
            });
            window.location.reload();
        } catch (err) {
            alert("unauthorized");
        }
    }

    render() {
        const {isAdmin, userID, post} = this.props;
        const isAuthor = (post.authorID === userID);
        if (!isAuthor && !isAdmin) {
            return <span></span>;
        }
        return (
            <button onClick={this.deletePost} className="btn">Delete</button>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAdmin: state.user.isAdmin,
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(DeletePost);
