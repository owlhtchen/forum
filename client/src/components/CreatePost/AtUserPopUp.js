import React, {Component} from 'react';
import './MarkdownEditor.scss';
import axios from 'axios';
import ProfileSmall from "../ProfileSummary/ProfileSmall";
import {getUsersWithPrefix} from "../../utils/user";

class AtUserPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithPrefix: []
        };
    }

    handleChange = async() => {
        const prefix = document.querySelector(".markdown__input").value;
        let usersWithPrefix = await getUsersWithPrefix(prefix);
        this.setState({
            usersWithPrefix
        });
    }

    render() {
        const { usersWithPrefix } = this.state;
        const { setSelectedUser } = this.props;
        return (
            <div className="markdown__popup AtUserPopUp">
                <input
                    type="text" className="markdown__input"
                    onChange={this.handleChange}
                    placeholder="type username here"
                />
                <div>
                    {usersWithPrefix.map((user, i) => {
                        return <ProfileSmall user={user}
                                             setSelectedUser={setSelectedUser}
                                             key={i}
                        />;
                    })}
                </div>
            </div>
        );
    }
}

export default AtUserPopUp;