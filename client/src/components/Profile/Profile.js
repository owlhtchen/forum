import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserByID, uploadUserAvatar} from '../../utils/user'
import LoadingCircle from "../Loading/LoadingCircle";
import './Profile.scss';
import SVGIcon from "../SVGIcon/SVGIcon";
import {ReactComponent as UploadSVG} from "../assets/upload.svg";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileUser: null
        };
    }

    async componentDidMount() {
        try {
            const {userID} = this.props.match.params;
            const profileUser = await getUserByID(userID);

            this.setState({
                profileUser: profileUser
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
        alert("upload");
        await uploadUserAvatar(userID, userAvatar);
    }

    render() {
        const {profileUser} = this.state;
        if (!profileUser) {
            return (
                <LoadingCircle />
            );
        }
        return (
            <div className="profile">
                <div className="profile__header">
                    <div className="profile__upper"/>
                    <div className="profile__image">
                        <img src={`/${profileUser.avatarFile}`} />
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
                    <div className="profile__intro">
                        intro
                    </div>
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