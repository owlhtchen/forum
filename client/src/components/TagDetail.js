import React, {Component} from 'react'
import {getTagByID} from '../utils/tag'
import PostSummary from './ViewPost/PostSummary';

export default class TagDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: null
        };
    }

    async componentDidMount() {
        const {tagID} = this.props.match.params;
        let tag = await getTagByID(tagID);
        this.setState({
            tag
        });
    }

    render() {
        const {tag} = this.state;
        if (!tag) {
            return (
                <div>
                    Loading ...
                </div>
            );
        }
        return (
            <div>
                <h2>Tag: {tag.name}</h2>
                {
                    tag.posts.map((post, index) => {
                        return <PostSummary post={post} key={index}></PostSummary>
                    })
                }
            </div>
        )
    }
}
