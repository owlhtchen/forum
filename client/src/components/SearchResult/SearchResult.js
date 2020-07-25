import React, {Component} from 'react'
import './SearchResult.scss';
import PostSummary from '../PostSummary/PostSummary';
import UserSummary from '../ProfileSummary/UserSummary';
import TagSummary from '../Tag/TagSummary';
import {getSearchResultsWith} from "../../utils/search";
import {ReactComponent as DiscussSVG} from "../assets/article.svg";
import {ReactComponent as ProfileSVG} from "../assets/profile.svg";
import {ReactComponent as HashTagSVG} from "../assets/hashtag.svg";
import {ReactComponent as PlusSVG} from "../assets/plus.svg";
import SVGIcon from "../SVGIcon/SVGIcon";

export default class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            posts: [],
            tags: [],
            postsShown: true,
            usersShown: true,
            tagsShown: true
        };
    }

    searchWithKeyword = async () => {
        const {keyword} = this.props.match.params;
        let {users, posts, tags} = await getSearchResultsWith(keyword);
        this.setState({
            users,
            posts,
            tags
        });
    }

    async componentDidMount() {
        await this.searchWithKeyword();
    }

    async componentDidUpdate(prevProps) {
        const {keyword} = this.props.match.params;
        if (keyword !== prevProps.match.params.keyword) {
            await this.searchWithKeyword();
        }
    }

    setShown = (postsShown, usersShown, tagsShown) => {
        this.setState({
            postsShown,
            usersShown,
            tagsShown
        })
    }

    showPosts = () => {
        this.setShown(true, false, false);
    }

    showUsers = () => {
        this.setShown(false, true, false);
    }

    showTags = () => {
        this.setShown(false, false, true);
    }

    showAll = () => {
        this.setShown(true, true, true);
    }

    render() {
        const {users, posts, tags, postsShown, usersShown, tagsShown} = this.state;
        return (
            <div className="search-result">
                <div className="search-result__left">
                    {
                        postsShown &&
                        <div>
                            <h1>Posts</h1>
                            {
                                posts.map((post, index) => {
                                    return <PostSummary key={index} post={post}/>
                                })
                            }
                        </div>
                    }
                    {
                        usersShown &&
                        <div>
                            <h1>Users</h1>
                            {
                                users.map((user, index) => {
                                    return <UserSummary key={index} user={user}/>
                                })
                            }
                        </div>
                    }
                    {
                        tagsShown &&
                        <div>
                            <h1>Tags</h1>
                            {
                                tags.map((tag, index) => {
                                    return <TagSummary key={index} tag={tag}/>
                                })
                            }
                        </div>
                    }
                </div>
                <div className="search-result__right">
                    <h1>Filter by</h1>
                    <div className="search-result__filter-panel">
                        <div className="search-result__filter-item"
                             onClick={this.showPosts}>
                            <SVGIcon>
                                <DiscussSVG />
                            </SVGIcon>
                            Posts
                        </div>
                        <div className="search-result__filter-item"
                             onClick={this.showUsers}>
                            <SVGIcon>
                                <ProfileSVG />
                            </SVGIcon>
                            Users
                        </div>
                        <div className="search-result__filter-item"
                             onClick={this.showTags}>
                            <SVGIcon>
                                <HashTagSVG />
                            </SVGIcon>
                            Tags
                        </div>
                        <div className="search-result__filter-item"
                             onClick={this.showAll}>
                            <SVGIcon>
                                <PlusSVG />
                            </SVGIcon>
                            Show all
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
