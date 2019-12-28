import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Dashboard from './Dashboard';

class App extends Component {
  state = {  }
  render() { 
    return (   
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Signup />
            <Dashboard />
          </div>
        </BrowserRouter>
      </div>
     );
  }
}
 
export default App;