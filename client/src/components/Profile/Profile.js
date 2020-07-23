import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserByID, uploadUserAvatar} from '../../utils/user'
import LoadingCircle from "../Loading/LoadingCircle";
import './Profile.scss';
import SVGIcon from "../SVGIcon/SVGIcon";
import {ReactComponent as UploadSVG} from "../assets/upload.svg";
import {ReactComponent as PenSVG} from "../assets/pen.svg";
import EditBio from "./EditBio";
import {getPostsByUserID} from "../../utils/post";
import PostCommentSummary from "../PostCommentSummary/PostCommentSummary";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileUser: null,
            editBioShown: false,
            posts: []
        };
    }

    async componentDidMount() {
        try {
            const {userID} = this.props.match.params;
            const profileUser = await getUserByID(userID);
            const posts = await getPostsByUserID(userID);
            this.setState({
                profileUser: profileUser,
                posts: posts
            });
        } catch (err) {
            console.log("axios exception in ProfileSmall Mount");
        }
    }

    uploadImage = async () => {
        const { userID } = this.props;
        let input = document.querySelector("#user-avatar");
        let userAvatar = input.files[0];
        console.log(userAvatar);
        if(!userAvatar || !userID) {
            return;
        }
        await uploadUserAvatar(userID, userAvatar);
        window.location.reload();
    }

    showEditBio = () => {
        this.setState({
            editBioShown: true
        })
    }

    hideEditBio = () => {
        this.setState({
            editBioShown: false
        })
    }

    render() {
        const { profileUser, editBioShown, posts } = this.state;
        const { userID } = this.props;
        if (!profileUser) {
            return (
                <LoadingCircle />
            );
        }
        let isMine = (profileUser._id === userID);
        return (
            <div className="profile">
                <div className="profile__header">
                    <div className="profile__upper"/>
                    <div className="profile__image">
                        <img src={`/${profileUser.avatarFile}`} />
                        { isMine &&
                            <div>
                                <label htmlFor="user-avatar">
                                    <SVGIcon
                                        width={"2.7vw"}
                                        fill={"#36c7f7"}
                                        tooltip={"upload profile image"}
                                    >
                                        <UploadSVG />
                                    </SVGIcon>
                                </label>
                                <input id="user-avatar" type="file" hidden
                                       onChange={this.uploadImage}
                                />
                            </div>
                        }
                    </div>
                    <div className="profile__intro">
                        <h1>{profileUser.username}</h1>
                        <h3>
                            <span>Bio: {profileUser.bio}</span>
                            { isMine &&
                            <SVGIcon onClick={() => { this.showEditBio(); }}  tooltip={"Edit bio"}>
                                <PenSVG />
                            </SVGIcon>
                            }
                        </h3>
                        {   editBioShown &&
                            <EditBio hideEditBio={this.hideEditBio}/>
                        }
                    </div>
                </div>
                <div className="profile__content">
                    <h1>Timeline</h1>
                    {
                        posts.map(post => {
                            return <PostCommentSummary post={post} />
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(Profile);