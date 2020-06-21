import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileDetailedSmall from "../Profile/ProfileDetailedSmall";
import './PostSummary.scss';
const ReactMarkdown = require('react-markdown/with-html')

export default class PostSummary extends Component {
    imageSize = (props) => {
        return <img {...props} style={{maxWidth: '50%'}} />
    }

    render() {
        const {post} = this.props;
        // console.log(post);
        return (
            <div className="post-summary">
                <ProfileDetailedSmall user={post.author} />
                <h2 className="post-summary__title">
                    <Link to={`/posts/view-post/${post._id}`} >
                        {post.title}
                    </Link>
                </h2>
                <div className="post-summary__content">
                    <ReactMarkdown
                        source={post.content}
                        escapeHtml={false}
                        disallowedTypes={['heading']}
                        unwrapDisallowed={true}
                        renderers={{image: this.imageSize}}
                    />
                </div>
            </div>
        )
    }
}
