import React, {Component} from 'react'
import axios from 'axios'

export default class MentionUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    getUsernameWithPrefix = async () => {
        const {id} = this.props;
        let prefix = document.getElementById("username-input").value;
        if (prefix === '') {
            document.getElementById(id).className += " d-none";
            return;
        }
        let res = await axios.get('/users/get-username-with-prefix/' + encodeURI(prefix));
        if (res.data) {
            document.getElementById(id).classList.remove("d-none");
            document.getElementById(id).size = res.data.length;
            this.setState({
                users: res.data
            });
        }
    }

    handleClickUsername = () => {
        const {setUser, id} = this.props;
        const userInfo = document.getElementById(id).value;
        setUser(userInfo);
    }

    render() {
        const {id} = this.props;
        const {users} = this.state;
        return (
            <div>
                <label htmlFor="username-input">input username:&nbsp;</label>
                <input id="username-input" type="text"
                       onChange={this.getUsernameWithPrefix}></input>
                <select id={id} className="d-none" onClick={this.handleClickUsername}>
                    {
                        users.map((user) => {
                            const userInfo = {'userID': user._id, "username": user.username};
                            return (
                                <option
                                    key={user._id}
                                    value={JSON.stringify(userInfo)}>
                                    {user.username}
                                </option>
                            );
                        })
                    }
                </select>
            </div>
        )
    }
}
