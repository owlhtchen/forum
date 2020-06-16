import React, {Component} from 'react';
import './MarkdownEditor.scss';
import axios from 'axios';
import ProfileSmall from "./ProfileSmall";

class AtUserPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithPrefix: []
        };
    }

    handleChange = async() => {
        const prefix = document.querySelector(".markdown__input").value;
        if(prefix) {
            const { data } = await axios.get(`/users/get-username-with-prefix/${prefix}`);
            this.setState({
                usersWithPrefix: data
            });
        } else {
            this.setState({
                usersWithPrefix: []
            })
        }
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