import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Signin from './Signin';

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
            </Switch>
          </div>
        </BrowserRouter>
      </div>
     );
  }
}
 
export default App;