import React, {Component} from 'react'
import debounce from "lodash.debounce"
import axios from 'axios';
import PostSummary from '../PostSummary/PostSummary';
import './LoadOnScroll.scss';
import LoadingCircle from "../Loading/LoadingCircle";
import { connect } from 'react-redux';

class LoadOnScroll extends Component {
    getMorePosts = async (posts, userID) => {
        try {
            let filter;
            this.setState({
                isLoading: true
            });
            if (posts.length === 0) {
                filter = {};
            } else {
                filter = {
                    lastPost: posts[posts.length - 1]
                }
            }
            let data = [];
            if(this.props.getMorePosts) {
                data = await this.props.getMorePosts(filter, userID);
            }

            if (data.length === 0) {
                this.setState({
                    isLoading: false,
                    hasMore: false
                });
            }
            let newPosts = posts.concat(data);
            // duplicatedPosts: remove posts with postComment(s)
            // const duplicatedPosts = posts
            //     .filter(post => {
            //         return post.postType === "post-comment";
            //     })
            //     .map(post => post.parentID);
            // const duplicatedPosts = [];
            // newPosts = newPosts.filter(post => {
            //     return !(post.postType === "post" && duplicatedPosts.includes(post._id))
            // })
            this.setState({
                isLoading: false,
                posts: newPosts
            });
        } catch (err) {
            console.log(err);
            console.log("error: getMorePosts in LoadOnScroll");
        }
    }

    constructor(props) {
        super(props);
        const { userID } = this.props;

        this.state = {
            hasMore: true,
            isLoading: false,
            posts: []
        };

        // Binds our scroll event handler
        window.onscroll = debounce(async () => {
            try {
                const {hasMore, isLoading, posts} = this.state
                if (isLoading || !hasMore) return;

                if (
                    (window.innerHeight + window.scrollY) >= document.body.offsetHeight
                ) {
                    alert("!");
                    await this.getMorePosts(posts, userID);
                }
            } catch (err) {
                console.log("error: onscroll in LoadOnScroll");
            }
        }, 100);
    }

    async componentDidMount() {
        const {posts} = this.state;
        const { userID } = this.props;
        await this.getMorePosts(posts, userID);
    }

    render() {
        const { posts } = this.state;
        let inner;
        if(posts.length === 0) {
            inner = <LoadingCircle width="15rem" height="15rem"/>
        } else {
            inner = posts.map((post) => {
                return <PostSummary post={post} key={post._id} />;
            })
        }
        return (
            <div>
                {inner}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(LoadOnScroll);
