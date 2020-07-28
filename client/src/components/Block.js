import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'

class Block extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocked: false
        }
    }

    async componentDidMount() {
        const {profileUser, userID} = this.props;
        try {
            let res = await axios.post('/users-back/check-block-user', {
                user: userID,
                victim: profileUser._id
            });
            this.setState({
                blocked: res.data
            });
        } catch (err) {
            console.log(err);
        }
    }

    handleBlock = async () => {
        const {blocked} = this.state;
        const {profileUser, userID} = this.props;
        await axios.post('/users-back/block-user', {
            user: userID,
            victim: profileUser._id,
            startBlocking: !blocked
        });
        this.setState({
            blocked: !blocked
        });
        window.location.reload();
    }

    render() {
        const {blocked} = this.state;
        return (
            <div>
                <button onClick={this.handleBlock}>
                    {
                        blocked ? "Unblock" : "Block"
                    }
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(Block);