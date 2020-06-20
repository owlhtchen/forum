import React, {Component} from 'react';
import './Loading.scss';

class Loading extends Component {

    render() {
        const { width, height } = this.props;
        return (
            <div className="loader"
            style={{width: width, height: height}}/>
        );
    }
}

export default Loading;