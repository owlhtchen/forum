import React, { Component } from 'react'
import Axios from 'axios';
import PostSummary from './PostSummary';

export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: [],
      categories: []
    };
  }

  async componentDidMount() {
    const { keyword } = this.props.match.params;
    console.log(keyword)
    let res = await Axios.get('/search/' + keyword);
    const { users, posts, categories } = res.data;
    console.log(res.data);
    this.setState({
      users,
      posts,
      categories
    });
  }

  async componentDidUpdate(prevProps) {
    const { keyword } = this.props.match.params;
    if(keyword != prevProps.match.params.keyword) {
      console.log(keyword)
      let res = await Axios.get('/search/' + keyword);
      const { users, posts, categories } = res.data;
      console.log(res.data);
      this.setState({
        users,
        posts,
        categories
      }); 
    }   
  }

  render() {
    const { users, posts, categories } = this.state;
    return (
      <div className="row">
        <div className="nav flex-column col-2 nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a className="nav-link" id="v-pills-post-tab" data-toggle="pill" href="#v-pills-post" role="tab" aria-controls="v-pills-post" aria-selected="false">Post</a>          
          <a className="nav-link" id="v-pills-user-tab" data-toggle="pill" href="#v-pills-user" role="tab" aria-controls="v-pills-user" aria-selected="true">User</a>
          <a className="nav-link" id="v-pills-category-tab" data-toggle="pill" href="#v-pills-category" role="tab" aria-controls="v-pills-category" aria-selected="false">Category</a>
        </div>
        <div className="tab-content col-10" id="v-pills-tabContent">
          <div className="tab-pane fade show active" id="v-pills-post" role="tabpanel" aria-labelledby="v-pills-post-tab">
            {
              posts.map((post, index) => {
                return <PostSummary key={index} post={post}></PostSummary>
              })
            }
          </div>
          <div className="tab-pane fade" id="v-pills-user" role="tabpanel" aria-labelledby="v-pills-user-tab">
          Cillum ad ut irure tempor velit nostrud occaecat ullamco aliqua anim Lorem sint. Veniam sint duis incididunt do esse magna mollit excepteur laborum qui. Id id reprehenderit sit est eu aliqua occaecat quis et velit excepteur laborum mollit dolore eiusmod. Ipsum dolor in occaecat commodo et voluptate minim reprehenderit mollit pariatur. Deserunt non laborum enim et cillum eu deserunt excepteur ea incididunt minim occaecat.          
          </div>
          <div className="tab-pane fade" id="v-pills-category" role="tabpanel" aria-labelledby="v-pills-category-tab">...</div>
        </div>
      </div>
    );
  }
}
