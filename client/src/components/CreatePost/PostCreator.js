import React, {Component} from 'react';
import MarkdownEditor from "./MarkdownEditor";
import './PostCreator.scss';
import HashTagPopUp from "./HashTagPopUp";
import axio from 'axios';

class PostCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mdeValue: "",
            tags: []   // should be tag mongodb objects
        }
    }

    removeTag = (e) => {
        let tagName = e.target.firstChild.innerHTML;
        let { tags } = this.state;
        let index = tags.findIndex(tag => tag.name === tagName);
        if (index !== -1) {
            tags.splice(index, 1);
            this.setState({tags: tags});
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    setMdeValue = (mdeValue) => {
        this.setState({
            mdeValue: mdeValue
        });
    }

    handleTagInput = () => {
        let prefix = document.querySelector('#tag-input');
        if(prefix) {
            // show popup
        }
    }

    createNewTag = async () => {
        let tagName = document.querySelector('#tag-input').value;
        if(!tagName || tagName.trim() === '') {
            alert("tag name should not be empty");
            return;
        }
        if(!tagName || tagName.match(/\W/g)) {
            alert("tag name should only contain alphanumeric characters [a-zA-Z0-9_]");
            return;
        }
        const { tags } = this.state;
        let index = tags.findIndex(tag => tag.name === tagName);
        if(index == -1) {
            let { data : tag} = await axio.post('/tags/add-tag', {
                name: tagName
            });
            this.setState({
                tags: tags.concat(tag)
            });
        }
        document.querySelector('#tag-input').value = "";
    }

    render() {
        const { mdeValue, tags } = this.state;
        return (
            <div className="post-creator">
                <form onSubmit={this.handleSubmit} className="post-form">
                    <div className="post-form__group">
                        <label htmlFor="title" className="post-form__label">Title</label>
                        <input type="text" id="title" className="post-form__input"/>
                    </div>
                    <div className="post-form__group">
                        <label htmlFor="tag-input" className="post-form__label">Tags</label>
                        <input type="text" id="tag-input" onChange={this.handleTagInput} className="post-form__input"/>
                        <span onClick={this.createNewTag} className="post-form__btn">Add</span>
                        {tags.map( (tag, i) => {
                            return <span key={i} className="post-form__tag"
                            onClick={this.removeTag}><span>{tag.name}</span></span>;
                        })}
                    </div>
                    <MarkdownEditor
                        mdeValue={mdeValue}
                        setMdeValue={this.setMdeValue}/>
                </form>
                <HashTagPopUp />
            </div>
        );
    }
}

export default PostCreator;