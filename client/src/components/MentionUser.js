import React, { Component } from 'react'
import axios from 'axios'

export default class MentionUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  getUsernameWithPrefix = async () => {
    const { id } =this.props;
    let prefix = document.getElementById("username-input").value;
    if(prefix === '') {
      document.getElementById(id).className += " d-none";
      return;
    }
    let res = await axios.get('/users/get-username-with-prefix/' + encodeURI(prefix));
    if(res.data) {
      document.getElementById(id).classList.remove("d-none");
      this.setState({
        users: res.data
      });      
    }
  }

  render() {
    const { id } = this.props;
    const { users } = this.state;
    console.log(users);
    return (
      <div>
        <label htmlFor="username-input">input username:&nbsp;</label>
        <input id="username-input" type="text" 
        onChange={this.getUsernameWithPrefix}></input>
        <select id={id} className="d-none">
          {
            users.map((user) => {
              return (
                <option 
                key={user._id}
                value={user._id}>{user.username}</option>
              );
            })
          }
        </select>
      </div>
    )
  }
}
