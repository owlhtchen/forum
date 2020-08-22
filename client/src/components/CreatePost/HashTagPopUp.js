import React, {Component} from 'react';
import './HashTagPopUp.scss';
import axios from 'axios';

class HashTagPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tagsWithPrefix: []
        }
    }

    componentDidUpdate() {
        const { hashPrefix } = this.props;
        if(hashPrefix && hashPrefix !== "") {
            let url = `/tags-back/get-tag-name-with-prefix/${encodeURI(hashPrefix)}`;
            axios.get(url)
                .then((res) => {
                    this.setState({
                        tagsWithPrefix: res.data
                    })
                }).catch((err) => {
                    this.props.endDetectedHash();
                    console.log("prefix not found: ", err)
            })
        }
    }

    // props takes in prefix, and call setSelectedHashTag
    render() {

        const { setSelectedHashTag } = this.props;
        const { tagsWithPrefix } = this.state;

        return (
            <div className="hash-popup HashTagPopUp">
                {tagsWithPrefix.map((tag, i) => {
                    return <p
                        key={i}
                        onClick={() => {
                            setSelectedHashTag(tag);
                        } }
                    className="hash-popup__name">#{tag.name}</p>
                })}
            </div>
        );
    }
}

export default HashTagPopUp;