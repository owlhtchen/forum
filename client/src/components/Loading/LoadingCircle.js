import React, {Component} from 'react';
import './Loading.scss';

class Loading extends Component {

    timeHandler = null;

    componentDidMount() {
        let { timeOut } = this.props;
        if(!timeOut) {
            timeOut = 9000;
        }
        this.timeHandler = setTimeout(() => {
            let loader = document.querySelector(".loader");
            loader.classList.remove("loader");
            let heading = document.querySelector(".not-found");
            heading.style.display = "block";
        }, timeOut);
    }

    componentWillUnmount() {
        if(this.timeHandler) {
            clearTimeout(this.timeHandler);
            this.timeHandler = null;
        }
    }

    render() {
        const { width, height } = this.props;
        return (
            <div>
                <h1 className="not-found">Sorry, no content found. Please check later</h1>
                <div className="loader"
                     style={{width: width, height: height}}>
                </div>
            </div>
        );
    }
}

export default Loading;