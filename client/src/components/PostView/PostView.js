import React, {Component} from 'react';

class PostView extends Component {
    // load data with a depth of 2

    constructor(props) {
        super(props);
        let postID = this.props.postID;
        if(postID === undefined) {
            postID = this.props.match.params.postID;
        }
        console.log(postID);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                Not done
            </div>
        );
    }
}

export default PostView;