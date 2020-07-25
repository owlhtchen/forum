import React, {Component} from 'react'
import {getTagByID} from '../../utils/tag'
import PostSummary from '../PostSummary/PostSummary';
import LoadingCircle from "../Loading/LoadingCircle";
import "./Tag.scss";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as HashtagSVG} from "../assets/hashtag.svg";

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: null
        };
    }

    getTag = async () => {
        const {tagID} = this.props.match.params;
        let tag = await getTagByID(tagID);
        this.setState({
            tag
        });
    }

    async componentDidMount() {
        await this.getTag();
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.match.params !== this.props.match.params) {
            await this.getTag();
        }
    }

    render() {
        const {tag} = this.state;
        if (!tag) {
            return (
                <LoadingCircle />
            );
        }
        return (
            <div className="tag">
                <h1>
                    <SVGIcon width={"2.5vw"}>
                        <HashtagSVG/>
                    </SVGIcon>&nbsp;
                    {tag.name}
                </h1>
                {
                    tag.posts.map(post => {
                        return <PostSummary post={post} key={post._id}/>
                    })
                }
            </div>
        )
    }
}
