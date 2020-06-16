import React, {Component} from 'react';
import './HashTagPopUp.scss';

class HashTagPopUp extends Component {
    // props takes in prefix, and call setSelectedHashTag
    render() {

        const { prefix } = this.props;

        return (
            <div className="hash-popup HashTagPopUp">
                <span>You typed {prefix}</span>
            </div>
        );
    }
}

export default HashTagPopUp;