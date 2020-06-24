import React, {Component} from 'react';
import PostBarIcon from "./PostBarIcon";
import {ReactComponent as BookmarkSVG} from "../assets/bookmark.svg";
import { connect } from 'react-redux';
import {cancelFavoritePost, checkFavorite, favoritePost} from "../../utils/user";
import {handleError} from "../../utils/index";
import './MorePopup.scss';

let bodyStyle = getComputedStyle(document.body);
let barColor = bodyStyle.getPropertyValue("--post-bar-icon-color");
let barColorActive = bodyStyle.getPropertyValue("--post-bar-icon-color-active");

class MorePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorite: null
        };
    }

    async componentDidMount() {
        let { post, userID } = this.props;
        if(userID) {
            let favorite = await checkFavorite(userID, post._id);
            this.setState({
                favorite
            });
        }
    }

    favorite = async () => {
        const { userID, post } = this.props;
        if(!userID) {
            return;
        }
        let { favorite } = this.state;
        try {
            if(!favorite) {
                await favoritePost(userID, post._id);
            } else {
                await cancelFavoritePost(userID, post._id);
            }
            this.setState({
                favorite: !favorite
            })
        } catch (e) {
            handleError(e);
        }

    }

    render() {
        const { favorite } = this.state;
        let inner;
        if(favorite === null) {
            inner = <p>Loading</p>;
        } else {
            inner =  <PostBarIcon
                        text={"Bookmark"}
                        tooltip="add to bookmark"
                        onClick={this.favorite}
                        fill={favorite? barColorActive : barColor}
                    >
                        <BookmarkSVG />
                    </PostBarIcon>;
        }
        return (
            <div className="post-bar__popup">
                {inner}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(MorePopup);