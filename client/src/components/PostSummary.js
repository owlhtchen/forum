import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class PostSummary extends Component {
  render() {
    const { post } = this.props;
    return (
      <div>
        <div className="card m-2">
          <div className="card-header h4">
            <Link to={"/posts/view-post/" + post._id } style={{
              color: "#000000"
            }}>{ post.title }</Link>
          </div>
          <div id="post-content-summary" className="card-body">
            <p className="h6 card-subtitle text-muted">{post.author[0].username}</p>
            <p className="card-text collapse post-content" id={"post-content-" + post.id}>{post.content}</p>
            <a className="collapsed" data-toggle="collapse" href={"#post-content-" + post.id}></a>
          </div>
        </div>        
      </div>
    )
  }
}
