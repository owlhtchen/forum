import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Signin from './Signin';
import Post from './PostCreator';
import Homepage from './Homepage';
import authGuard from './authGuard';
import PostLoader from './PostLoader';
import Profile from './Profile';

class App extends Component {
  state = {  }
  render() { 
    return (   
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={ Homepage } />
              <Route exact path="/dashboard" component={ authGuard(Dashboard) } />
              <Route exact path="/users/signup" component={ Signup } />
              <Route exact path="/users/signin" component={ Signin } />
              <Route exact path="/posts/make-post" component={authGuard(Post)} />
              <Route exact path="/posts/view-post/:postID" component={PostLoader} />
              <Route exact path="/users/profile/:userID" component={Profile} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
     );
  }
}
 
export default App;