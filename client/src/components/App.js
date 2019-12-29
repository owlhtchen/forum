import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Signin from './Signin';
import Post from './Post';

class App extends Component {
  state = {  }
  render() { 
    return (   
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/dashboard" component={ Dashboard } />
              <Route exact path="/users/signup" component={ Signup } />
              <Route exact path="/users/signin" component={ Signin } />
              <Route exact path="/posts/makepost" component={Post} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
     );
  }
}
 
export default App;