import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import Header from './Header/Header';
import Signup from './SignIn/Signup';
import Dashboard from './GetSecret';
import Signin from './SignIn/Signin';
import Post from './CreatePost/PostCreator';
import Homepage from './Homepage';
import authGuard from './authGuard';
import PostLoader from './PostLoader';
import Profile from './Profile';
import Category from './Category';
import SearchResult from './SearchResult'
import CategoryDetail from './CategoryDetail'
import BrowseHistory from './BrowseHistory'
import Sidebar from "./Sidebar/Sidebar";
import './App.scss';
import GetSecret from "./GetSecret";

class App extends Component {

    render() {
        return (
            <div className="container">
                {/* <BrowserRouter forceRefresh={true}> */}
                <BrowserRouter>
                    <Header />
                    <Sidebar />
                    <div className="content">
                        <Switch>
                            <Route exact path="/get-secret" component={authGuard(GetSecret)}/>
                            <Route exact path="/users/signup" component={Signup}/>
                            <Route exact path="/users/signin" component={Signin}/>
                            <Route exact path="/posts/make-post" component={authGuard(Post)}/>
                            <Route exact path="/posts/view-post/:postID" component={PostLoader}/>
                            <Route exact path="/users/profile/:userID" component={authGuard(Profile)}/>
                            <Route exact path="/categories/edit-category" component={Category}/>
                            <Route exact path="/categories/category-by-id/:categoryID" component={CategoryDetail}/>
                            <Route exact path="/search/:keyword?" component={SearchResult}/>
                            <Route exact path="/users/browse-history" component={BrowseHistory}/>
                            <Route exact path="/" component={Homepage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;