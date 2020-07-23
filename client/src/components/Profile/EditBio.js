import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'

class EditBio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: ''
        };
    }

    handleSubmit = async (e) => {
        const {bio} = this.state;
        const {userID} = this.props;
        await axios.post('/users/edit-bio', {
            bio: bio,
            userID: userID
        });
    }

    handleEdit = (e) => {
        this.setState({
            bio: e.target.value
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <label htmlFor="user-bio">Edit Bio: &nbsp;</label>
                        <input type="text" onChange={this.handleEdit} name="user-bio"></input>
                        <button>Submit Bio</button>
                    </fieldset>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(EditBio);