import React, {Component} from 'react';
import ProfileSmall from "../ProfileSummary/ProfileSmall";
import {getUsersWithPrefix} from "../../utils/user";
import './AddContact.scss';

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

    render() {
        const { usersWithPrefix } = this.state;
        const { setSelectedUser } = this.props;

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
                                    setSelectedUser={setSelectedUser}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default AddContact;