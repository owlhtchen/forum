import React, {Component} from 'react';
import './LoadingCircle.scss';

let bodyStyle = getComputedStyle(document.body);
let loadingPrimaryColor = bodyStyle.getPropertyValue("--loading-primary-color");
let loadingBgColor = bodyStyle.getPropertyValue("--loading-bg-color");

class LoadingCircle extends Component {

    timeHandler = null;

    componentDidMount() {
        let { timeOut } = this.props;
        if(!timeOut) {
            timeOut = 9000;
        }
        this.timeHandler = setTimeout(() => {
            let loader = document.querySelector(".loader");
            let parent = loader.parentNode;
            parent.removeChild(loader);
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
        let { width, height } = this.props;
        height = (height === undefined) ? width:height;
        let borderWidth = (parseInt(width) * 0.15) + "rem";
        return (
            <div>
                <h1 className="not-found">Sorry, no content found. Please check later</h1>
                <div className="loader"
                     style={{
                         width: width,
                         height: height,
                         border:   `${borderWidth} solid ${loadingBgColor}`,
                         borderTop: `${borderWidth} solid ${loadingPrimaryColor}`
                     }}>
                </div>
            </div>
        );
    }
}

export default LoadingCircle;