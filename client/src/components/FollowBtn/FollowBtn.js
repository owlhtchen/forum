import React, {Component} from 'react'
import axios from 'axios'
import './FollowBtn.scss'

class FollowBtn extends Component {
    // this.props: following, toggleFollow

    constructor(props) {
        super(props);
        this.state = {
            following: this.props.following
        }
    }

    toggleFollow = async () => {
        if(this.props.toggleFollow) {
            await this.props.toggleFollow();
        }
    }

    render() {
        let {following} = this.props;
        let button;
        if(following) {
            button = (
                <button onClick={this.toggleFollow} className="showUnFollow">
                    <span>Following</span>
                </button>
            );
        } else {
            button = (
                <button onClick={this.toggleFollow}>
                    <span>Follow</span>
                </button>
            );
        }
        return (
            <div className="follow-btn">
                {button}
            </div>
        )
    }
}

export default FollowBtn