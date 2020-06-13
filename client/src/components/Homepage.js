import React, {Component} from 'react'
import debounce from "lodash.debounce"
import axios from 'axios';
import PostSummary from './PostSummary';

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
            const newPosts = posts.concat(res.data);
            this.setState({
                isLoading: false,
                posts: newPosts
            });
        } catch (err) {
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
        return (
            <div className="mt-3">
                <h2 className="mb-3" id="homepage">Homepage</h2>
                <div className="post-header">
                    <div className='post-header-post'>Post</div>
                    <div className='post-header-category'>Category</div>
                    <div className='post-header-comment'>Comments</div>
                    <div className='post-header-upvotes'>Upvotes</div>
                </div>
                {
                    this.state.posts.map((post, index) => {
                        const color = (() => {
                            switch (index % 3) {
                                case 0:
                                    return '#f2f4f6';
                                case 1:
                                    return '#ffffff';
                                case 2:
                                    return '#f9f4ee';
                            }
                        })();
                        return (
                            <PostSummary key={index} post={post} backgroundColor={color}></PostSummary>
                        );
                    })
                }
            </div>
        )
    }
}
