import React, {Component} from 'react';
import LoadOnScroll from "./LoadOnScroll";
import './Homepage.scss';
import {getTrendingPost, getFollowingPost} from "../../utils/post";
import { connect } from 'react-redux';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trendingShown: true,
        };
    }

    showTrending = () => {
        this.setState({
            trendingShown: true
        })
    }

    showFollowing = () => {
        if(!this.props.userID) {
            this.props.history.push('/users/signin');
            return;
        }
        this.setState({
            trendingShown: false
        });
    }

    render() {
        const { trendingShown } = this.state;
        let content;
        if(trendingShown) {
            content = (
                <LoadOnScroll getMorePosts={getTrendingPost}
                />
            );
        } else {
            content = (
                <div>
                    <LoadOnScroll
                        getMorePosts={getFollowingPost}
                    />
                </div>
            )
        }
        return (
            <div className="homepage">
                <div className="homepage__choice">
                    <span onClick={this.showTrending}>Trending</span>
                    <span onClick={this.showFollowing}>For you</span>
                </div>
                {content}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(Homepage);