import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import './UploadImage.scss'

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
    }

    handleChoose = async (e) => {
        this.setState({
            file: e.target.files[0]
        });
        const {userID} = this.props;
        let formData = new FormData();
        if (!userID || !this.state.file) {
            return;
        }
        formData.append('userID', userID);
        formData.append('userAvatar', this.state.file);
        const config = {
            'headers': {
                'content-type': "multipart/form-data"
            }
        };
        await axios.post('/upload/avatar', formData, config);
    }

    render() {
        return (
            <div className="upload-cover">
                <label htmlFor="user-avatar">Choose avatar</label>
                <input id="user-avatar" type="file" onChange={this.handleChoose} name="user-avatar"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(UploadImage);