import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import './EditBio.scss'

class EditBio extends Component {

    handleSubmit = async () => {
        let bioInput = document.querySelector("#user-bio");
        if(!bioInput || !bioInput.value) {
            return;
        }
        const {userID} = this.props;
        await axios.post('/users/edit-bio', {
            bio: bioInput.value,
            userID: userID
        });
    }

    render() {
        const { hideEditBio } = this.props;
        return (
            <form onSubmit={this.handleSubmit} className="edit-bio">
                <input type="text" id="user-bio" name="user-bio"/>
                <button className="edit-bio__btn">Save</button>
                <div className="edit-bio__btn"
                     onClick={hideEditBio}
                >Cancel</div>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(EditBio);