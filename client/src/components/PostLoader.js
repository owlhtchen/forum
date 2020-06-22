import React, {Component} from 'react'
import axios from 'axios'
import PostView from './PostView'
import {connect} from 'react-redux';

class PostLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null
        };
    }

    getPostOnUrlChange = async () => {
        const {postID} = this.props.match.params;
        const {userID} = this.props;
        let url = '/posts/expanded-post/' + postID;
        if (userID) {
            url += '/' + userID;
        }
        const res = await axios.get(url);
        this.setState({
            post: res.data
        });
    }

    async componentDidMount() {
        try {
            await this.getPostOnUrlChange();
        } catch (err) {
            console.log("axios exception in PostDetail");
        }
    }

    // async componentDidUpdate(prevProps) {
    //   if (this.props.match.params.postID !== prevProps.match.params.postID) {
    //     await this.getPostOnUrlChange();
    //   }
    // }

    render() {
        if (!this.state.post) {
            return (
                <div>
                    Loading ...
                </div>
            );
        }
        return (
            <div>
                <PostView post={this.state.post}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(PostLoader);