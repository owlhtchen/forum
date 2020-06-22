import React, {Component} from 'react'
import debounce from "lodash.debounce"
import axios from 'axios';
import PostSummary from '../ViewPost/PostSummary';
import './Homepage.scss';
import Loading from "../Loading/Loading";

export default class Homepage extends Component {
    getMorePost = async (posts) => {
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
            const res = await axios.post('/posts/filter-sorted-posts', filter);
            if (res.length === 0) {
                this.setState({
                    isLoading: false,
                    hasMore: false
                });
            }
            posts = posts.concat(res.data);
            // duplicatedPosts: remove posts with postComment(s)
            // const duplicatedPosts = posts
            //     .filter(post => {
            //         return post.postType === "post-comment";
            //     })
            //     .map(post => post.parentID);
            const duplicatedPosts = [];
            const newPosts = posts.filter(post => {
                return !(post.postType === "post" && duplicatedPosts.includes(post._id))
            })
            this.setState({
                isLoading: false,
                posts: newPosts
            });
        } catch (err) {
            console.log(err);
            console.log("error: getMorePost in Homepage");
        }
    }

    constructor(props) {
        super(props);

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
                    window.innerHeight + document.documentElement.scrollTop
                    >= document.documentElement.offsetHeight * 0.9
                ) {
                    await this.getMorePost(posts);
                }
            } catch (err) {
                console.log("error: onscroll in Homepage");
            }
        }, 100);
    }

    async componentDidMount() {
        const {posts} = this.state;
        await this.getMorePost(posts);
    }

    render() {
        const { posts } = this.state;
        let inner;
        if(posts.length === 0) {
            inner = <Loading width="20rem" height="20rem"/>
        } else {
            inner = posts.map((post) => {
                return <PostSummary post={post} key={post._id} />;
            })
        }
        return (
            <div className="homepage">
                {inner}
            </div>
        );
    }
}
