import React, {Component} from 'react';
import ProfileSmall from "../ProfileSummary/ProfileSmall";
import {getChatRoomName, getUsersWithPrefix} from "../../utils/user";
import './AddContact.scss';
import {connect} from "react-redux";

class AddContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithPrefix: []
        };
    }

    handleChange = async() => {
        const prefix = document.querySelector(".add-contact__input").value;
        let usersWithPrefix = await getUsersWithPrefix(prefix);
        this.setState({
            usersWithPrefix
        });
    }

    setSelectedUser = (selectedUser) => {
        const {setSelectedUser, socket, userID: secondID } = this.props;
        setSelectedUser(selectedUser);
        const firstID = selectedUser._id.toString();
        let chatRoomName = getChatRoomName(firstID, secondID).toString();
        socket.emit("room", { chatRoomName, firstID, secondID });
    }

    render() {
        const { usersWithPrefix } = this.state;

        return (
            <div className="add-contact">
                <input
                    type="text"
                    className="add-contact__input"
                    onChange={this.handleChange}
                    placeholder={"type username here"}
                />
                <div className="add-contact__popup">
                    {
                        usersWithPrefix.map(user => {
                            return (
                                <ProfileSmall
                                    key={user._id}
                                    user={user}
                                    setSelectedUser={this.setSelectedUser}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(AddContact);