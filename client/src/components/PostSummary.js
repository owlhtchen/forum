import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class PostSummary extends Component {
  constructor() {
    super();
  }
  render() {
    const { post,backgroundColor } = this.props;
    console.log(this.props);
    return (
      <div className="post-summary" style={{
        'backgroundColor': backgroundColor
      }}>
        <div className="card card-fade-in"  style={{
          'backgroundColor': backgroundColor
        }}>
          {/*<div className="card-header"  style={{*/}
          {/*  'backgroundColor': backgroundColor*/}
          {/*}}>*/}
          {/*  <Link to={"/posts/view-post/" + post._id } style={{*/}
          {/*    color: "#000000"*/}
          {/*  }}>{ post.title }</Link>*/}
          {/*</div>*/}
          {/*<div className="post-author">*/}
          {/*    <p className="ml-3 card-subtitle text-muted">{post.author[0].username}</p>*/}
          {/*</div>*/}

         <div style={{
           'display':'flex'
         }}>
           <div className="post-header-post" style={{
             'display':'flex',
             'width':'400px'
           }}>
             <div className="mt-4" style={
               {
                 'flex':'0 0 65%'
               }
             }>  <Link to={"/posts/view-post/" + post._id } style={{
                  color: "#000000"
                }}>{ post.title }</Link>
             </div>
             <div className="mt-4" style={{
               'flex':1
             }}>{`by ${post.author[0].username}`}</div>
           </div>
           <div className='post-header-category mt-4'>{post.category[0].name}</div>
           <div className='post-header-comment mt-4'>{post.commentIDs.length}</div>
           <div className='post-header-upvotes mt-4'>{post.likedBy.length}</div>
          </div>
        </div>        
      </div>
    )
  }
}
