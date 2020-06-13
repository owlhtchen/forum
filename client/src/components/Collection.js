import React, {Component} from 'react'
import {getArticlesByUserID} from '../utils/index'
import {Link} from 'react-router-dom'

export default class Collection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        };
    }

    async componentDidMount() {
        const {profileUser} = this.props;
        let articles = await getArticlesByUserID(profileUser._id);
        this.setState({
            articles
        });
    }

    render() {
        const {articles} = this.state;
        return (
            <div>
                {
                    articles.map((article, index) => {

                        return (
                            <div className="card m-2 card-fade-in" key={index}>
                                <div className="card-header h4">
                                    <Link to={"/posts/view-post/" + article._id} style={{
                                        color: "#000000"
                                    }}>{article.title}</Link>
                                </div>
                                <div id="post-content-summary" className="card-body">
                                    <p className="h6 card-subtitle text-muted">{article.author[0].username}</p>
                                    <p className="card-text collapse post-content"
                                       id={"post-content-" + index}>{article.content}</p>
                                    <a className="collapsed" data-toggle="collapse" href={"#post-content-" + index}></a>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}
