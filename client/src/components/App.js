import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import Header from './Header/Header';
import Signup from './SignIn/Signup';
import Signin from './SignIn/Signin';
import Post from './CreatePost/PostCreator';
import Homepage from './Homepage/Homepage';
import authGuard from './authGuard';
import Profile from './Profile/Profile';
import SearchResult from './SearchResult/SearchResult'
import Tag from './Tag/Tag'
import BrowseHistory from './BrowseHistory/BrowseHistory'
import Sidebar from "./Sidebar/Sidebar";
import './App.scss';
import GetSecret from "./GetSecret";
import PostView from "./PostView/PostView";
import Bookmarks from "./Bookmarks/Bookmarks";
import Messenger from "./Messenger/Messenger";
import SVGIcon from "./SVGIcon/SVGIcon";
import {ReactComponent as GithubSVG} from "./assets/github-logo.svg";
import axios from 'axios';

class App extends Component {

    jumpToGithub = async () => {
        window.location.href = "https://github.com/owlhtchen/forum";
    }

    render() {
        return (
            <div className="container">
                {/* <BrowserRouter forceRefresh={true}> */}
                <BrowserRouter>
                    <div className="github-link">
                        <SVGIcon
                            onClick={this.jumpToGithub}
                            fill={"black"}
                            width={"7vw"}
                            tooltip={"view on github"}
                        >
                            <GithubSVG />
                        </SVGIcon>
                    </div>
                    <Header />
                    <Sidebar />
                    <div className="content">
                        <Switch>
                            <Route exact path="/get-secret" component={authGuard(GetSecret)}/>
                            <Route exact path="/users/signup" component={Signup}/>
                            <Route exact path="/users/signin" component={Signin}/>
                            <Route exact path="/posts/make-post" component={authGuard(Post)}/>
                            <Route
                                exact path="/posts/expanded-post/:postID"
                                render={props => <PostView {...props} /> }
                            />
                            <Route exact path="/users/browse-history/:userID" component={authGuard(BrowseHistory)}/>
                            <Route exact path="/users/bookmarks/:userID" component={authGuard(Bookmarks)}/>
                            <Route exact path="/users/messenger/:userID" component={authGuard(Messenger)}/>

                            <Route exact path="/users/profile/:userID" component={Profile}/>
                            <Route exact path="/tags/tag-by-id/:tagID" component={Tag}/>
                            <Route exact path="/search/:keyword?" component={SearchResult}/>
                            <Route exact path="/" component={Homepage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;