import React, {Component} from 'react';
import './Messenger.scss';
import axios from "axios";
import {getUsersWithPrefix} from "../../utils/user";
import ProfileSmall from "../Profile/ProfileSmall";

class Messenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithPrefix: []
        };
    }

    handleChange = async() => {
        const prefix = document.querySelector(".messenger__input").value;
        let usersWithPrefix = await getUsersWithPrefix(prefix);
        this.setState({
            usersWithPrefix
        });
    }

    setSelectedUser = async (user) => {
        console.log(user);
    }

    render() {
        const { usersWithPrefix } = this.state;
        return (
            <div className="messenger">
                <div className="messenger__contacts">
                    <div className="messenger__prefix">
                        <input
                            type="text"
                            className="messenger__input"
                            onFocus={() => { console.log("yes"); }}
                            onBlur={() => {console.log("no"); }}
                            onChange={this.handleChange}
                        />
                        <div className="messenger__popup">
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

                </div>
                <div className="messenger__messages">

                </div>
            </div>
        );
    }
}

export default Messenger;