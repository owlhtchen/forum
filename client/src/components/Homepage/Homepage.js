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
        this.setState({
            trendingShown: false
        });
    }

    redirectLogin = () => {
        const { userID } = this.props;
        if(!userID) {
            this.props.history.push('/users/signin');
        }
    }

    render() {
        const { trendingShown } = this.state;
        let content;
        if(trendingShown) {
            content = (
                <LoadOnScroll getMorePosts={getTrendingPost}
                id={"1"}/>
            );
        } else {
            content = (
                <div onClick={this.redirectLogin}>
                    <LoadOnScroll
                        getMorePosts={getFollowingPost}
                        id={"2"}
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