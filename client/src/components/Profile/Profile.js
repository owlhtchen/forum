import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserByID, toggleFollow, uploadUserAvatar} from '../../utils/user'
import LoadingCircle from "../Loading/LoadingCircle";
import './Profile.scss';
import SVGIcon from "../SVGIcon/SVGIcon";
import {ReactComponent as UploadSVG} from "../assets/upload.svg";
import {ReactComponent as PenSVG} from "../assets/pen.svg";
import {ReactComponent as MessageSVG} from "../assets/message.svg";
import EditBio from "./EditBio";
import {getPostsByUserID} from "../../utils/post";
import PostCommentSummary from "../PostCommentSummary/PostCommentSummary";
import {Link} from "react-router-dom";
import {formatDate} from "../../utils";
import FollowUser from "../FollowBtn/FollowBtn";
import {checkFollowUser} from '../../utils/user';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileUser: null,
            editBioShown: false,
            posts: [],
            following: null
        };
    }

    async componentDidMount() {
        try {
            const {userID} = this.props.match.params;
            const profileUser = await getUserByID(userID);
            const posts = await getPostsByUserID(userID);
            let following = false;
            if(userID) {
                following = await checkFollowUser(profileUser._id, userID);
            }
            this.setState({
                profileUser: profileUser,
                posts: posts,
                following: following
            });
        } catch (err) {
            console.log("axios exception in ProfileSummary Mount");
        }
    }

    uploadImage = async () => {
        const { userID } = this.props;
        let input = document.querySelector("#user-avatar");
        let userAvatar = input.files[0];
        if(!userAvatar || !userID) {
            return;
        }
        try {
            await uploadUserAvatar(userID, userAvatar);
            window.location.reload();
        } catch (e) {
            alert("upload file failed, file type must be jpeg, jpg, png. file size should be less than 1MB");
        }
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

    editBio = (bio) => {
        const { profileUser: prev } = this.state;
        prev.bio = bio;
        this.setState({
            profileUser: prev
        });
    }

    toggleFollow = async () => {
        const { profileUser, following } = this.state;
        const { userID } = this.props;
        if(!userID) {
            this.props.history.push("/users/signin");
            return ;
        }
        await toggleFollow(profileUser._id, userID, following);
        this.setState({
            following: !following
        })
    }

    render() {
        const { profileUser, editBioShown, posts, following } = this.state;
        const { userID } = this.props;
        if (!profileUser || following === null) {
            return (
                <LoadingCircle />
            );
        }
        let isMine = (profileUser._id === userID);
        let messageBoxUrl = userID ? `/users/messenger/${userID}` : "/users/signin";
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
                                        width={"2vw"}
                                        fill={"#36c7f7"}
                                        tooltip={"upload profile image"}
                                    >
                                        <UploadSVG />
                                    </SVGIcon>
                                </label>
                                <input id="user-avatar" type="file" hidden
                                       onChange={this.uploadImage}
                                       accept="image/x-png,image/jpg,image/jpeg"
                                />
                            </div>
                        }
                    </div>
                    <div className="profile__intro">
                        <div className="profile__first-row">
                            <h1>
                                {profileUser.username}
                            </h1>
                            <Link
                                to={{
                                    pathname: messageBoxUrl,
                                    state: { selectedReceiver: profileUser }
                                }}
                            >
                                <SVGIcon width="5rem" fill="black" tooltip="Message me">
                                    <MessageSVG />
                                </SVGIcon>
                            </Link>
                            {
                                !isMine &&
                                <FollowUser
                                    following={following}
                                    toggleFollow={this.toggleFollow}
                                />
                            }
                        </div>
                        <div>
                            <span>Bio: {profileUser.bio}</span>
                            { isMine &&
                            <SVGIcon onClick={() => { this.showEditBio(); }}  tooltip={"Edit bio"}>
                                <PenSVG />
                            </SVGIcon>
                            }
                        </div>
                        {   editBioShown &&
                            <EditBio
                                hideEditBio={this.hideEditBio}
                                editBio={this.editBio}
                            />
                        }
                        <p>
                            Joined {formatDate(new Date(profileUser.joinDate))}
                        </p>
                    </div>
                </div>
                <div className="profile__content">
                    <h1>Timeline</h1>
                    {
                        posts.map(post => {
                            return <PostCommentSummary post={post}
                            key={post._id}/>
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