import React, {Component} from 'react';
import MarkdownEditor from "./MarkdownEditor";
import './PostCreator.scss';
import HashTagPopUp from "./HashTagPopUp";
import axio from 'axios';
import { connect } from 'react-redux';
import {addPost} from "../../utils/post";


class PostCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mdeValue: "",
            tags: []   // should be tag mongodb objects
        }
    }

    reset = () => {
        this.setState({
            mdeValue: '',
            tags: []
        });
        document.querySelector("#title").value = "";
        document.querySelector("#tag-input").value = "";
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

    handleSubmit = async (e) => {
        e.preventDefault();
        const title = document.querySelector('#title').value.trim();
        const tagIDs = this.state.tags.map((tag) => { return tag._id });
        const content = this.state.mdeValue;
        const authorID = this.props.userID;
        const postType = "post";
        if(title === "" || content.trim() === "") {
            alert("title and content cannot be empty");
            return;
        }
        try {
            let post = await addPost(postType, authorID, content, title, tagIDs);
            // TODO: reset after submit
            console.log(post);
            this.reset();
            if(post && post._id) {
                this.props.history.push(`/posts/expanded-post/${post._id}`);
            } else {
                throw "error occurred when submitting post.";
            }
        } catch (e) {
            alert("error occurred when submitting post.");
        }
    }

    setMdeValue = (mdeValue) => {
        this.setState({
            mdeValue: mdeValue
        });
    }

    handleTagInput = () => {
        let prefix = document.querySelector('#tag-input');
        if(prefix) {
            //TODO: show popup
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
        if(index === -1) {
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
                        setMdeValue={this.setMdeValue}
                    />
                    <button
                        className="post-form__btn post-form__submit" type="submit"
                    >Submit</button>
                    <button
                        className="post-form__btn post-form__submit" onClick={this.reset}
                    >Reset</button>
                </form>
                <HashTagPopUp />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };

}

export default connect(mapStateToProps)(PostCreator);