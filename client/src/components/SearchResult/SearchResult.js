import React, {Component} from 'react'
import Axios from 'axios';
import './SearchResult.scss';
import PostSummary from '../PostSummary/PostSummary';
import UserSummary from '../ProfileSummary/UserSummary';
import TagSummary from '../TagSummary';

export default class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            posts: [],
            tags: []
        };
    }

    async componentDidMount() {
        const {keyword} = this.props.match.params;
        let res = await Axios.get('/search/' + keyword);
        const {users, posts, tags} = res.data;
        this.setState({
            users,
            posts,
            tags
        });
    }

    async componentDidUpdate(prevProps) {
        const {keyword} = this.props.match.params;
        if (keyword !== prevProps.match.params.keyword) {
            let res = await Axios.get('/search/' + keyword);
            const {users, posts, tags} = res.data;
            this.setState({
                users,
                posts,
                tags
            });
        }
    }

    render() {
        const {users, posts, tags} = this.state;
        return (
            <div className="search-result">
                <div>
                    {
                        posts.map((post, index) => {
                            return <PostSummary key={index} post={post}/>
                        })
                    }
                </div>
                <div>
                    {
                        users.map((user, index) => {
                            return <UserSummary key={index} user={user}/>
                        })
                    }
                </div>
                <div>
                    {
                        tags.map((tag, index) => {
                            return <TagSummary key={index} tag={tag}/>
                        })
                    }
                </div>
            </div>
        );
    }
}
