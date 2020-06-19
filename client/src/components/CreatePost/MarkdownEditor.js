import React, {Component} from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import './MarkdownEditor.scss';
import AtUserPopUp from "./AtUserPopUp";
import HashTagPopUp from "./HashTagPopUp";

class MarkdownEditor extends Component {

    // this.props: mdeValue, setMdeValue
    uniqueId = "mde-editor-storage";

    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
            mdeInstance: null,
            detectedHash: false,
            hashPrefix: ''
        };
    }

    handleChange = (value) => {
        this.props.setMdeValue(value);
    }

    componentDidMount() {
        const saved = localStorage.getItem(`smde_${this.uniqueId}`) || '';
        this.props.setMdeValue(saved);
    }

    setSelectedUser = (user) => {
        let namePopUp = document.querySelector(".markdown__popup");
        this.setState({
            selectedUser: user
        });
        namePopUp.style.display = "none";
        const { mdeInstance } = this.state;
        if(mdeInstance) {
            const cm = mdeInstance.codemirror;
            let { line, ch } = cm.getCursor();
            const url = `[@${user.username}](/users/profile/${user._id})`;
            // console.log(url);
            cm.doc.replaceRange(url,
                {line: line, ch: ch -1},
                {line: line, ch: ch});
            cm.focus();
        }
    }

    setSelectedHashTag = (tag) => {
        const { mdeInstance } = this.state;
        if(mdeInstance) {
            const cm = mdeInstance.codemirror;
            let wordRange = cm.findWordAt(cm.getCursor());
            wordRange.anchor.ch -= 1;
            let url = `[#${tag.name}](/tags/tag-by-id/${tag._id})`;
            console.log("selected hash tag: ", url);
            cm.doc.replaceRange(url,
                wordRange.anchor,
                wordRange.head);
            cm.focus();
            this.endDetectedHash(cm);
        }
    }

    setMdeInstance = (mdeInstance) => {
        this.setState({
            mdeInstance: mdeInstance
        });
    }

    showAtUserPopUp = (cm) => {
        let namePopUp = document.querySelector(".markdown__popup");
        let nameInput = namePopUp.querySelector(".markdown__input");
        let {left, top} = cm.cursorCoords(true, "window");
        namePopUp.style.left = (4 + left) + 'px';
        namePopUp.style.top = top + 'px';
        namePopUp.style.display = 'block';
        setTimeout(() => {
            // a hack from: https://stackoverflow.com/questions/30018357/override-autofocus-attribute-with-javascript-jquery
            nameInput.focus();
            nameInput.select();
        }, 120);
    }

    closePopUps = () => {
        this.closeAtUserPopUp();
    }

    closeAtUserPopUp = () => {
        let namePopUp = document.querySelector(".markdown__popup");
        namePopUp.style.display = 'none';
    }

    getHashPrefix = (cm) => {
        let wordRange = cm.findWordAt(cm.getCursor());
        return cm.getRange(wordRange.anchor, wordRange.head);
    }

    endDetectedHash = () => {
        let hashPopUp = document.querySelector(".hash-popup");
        hashPopUp.style.display = 'none';
        this.setState({
            detectedHash: false,
            hashPrefix: ''
        });
    }

    handleBlur = (cm, e) => {
        let hashPopUp = document.querySelector(".hash-popup");
        if(hashPopUp.contains(e.target)) {
            alert("returned");
            return;
        }
        this.endDetectedHash();
    }

    startDetectedHash = (cm) => {
        this.setState({
            detectedHash: true
        });
    }

    showHashPopUp = (cm) => {
        let hashPopUp = document.querySelector(".hash-popup");
        let {left, top} = cm.cursorCoords(true, "window");
        let creatorFontsize = parseFloat(
            window.getComputedStyle(
                document.querySelector(".post-creator")).fontSize);
        hashPopUp.style.left = (2 + left) + 'px';
        hashPopUp.style.top = (top + creatorFontsize + 2) + 'px';
        hashPopUp.style.display = 'block';
    }

    handlePrefix = (cm) => {
        let { line, ch } = cm.getCursor();
        if(ch < 1) {
            return;
        }
        const { detectedHash } = this.state;
        let inputChar = cm.doc.getLine(line).charAt(ch - 1);
        if(detectedHash && (/\s/.test(inputChar) || inputChar === '[')) {
            // inputChar === '[': not a hashtag, it's a markdown format link
            this.endDetectedHash();
            return;
        } else if(inputChar === '#') {
            this.endDetectedHash();
            this.startDetectedHash(cm);
            return;
        } else if(detectedHash) {
                let prefix = this.getHashPrefix(cm);
                this.setState({
                    hashPrefix: prefix
                });
                this.showHashPopUp(cm);
                return;
        }
    }

    detachSpecialChar = (cm) => {
        let { line, ch } = cm.getCursor();
        if(ch < 1) {
            return;
        }
        let inputChar = cm.doc.getLine(line).charAt(ch - 1);

        if(inputChar === '@') {
            this.showAtUserPopUp(cm);
        } else if(inputChar === '#') {
            this.startDetectedHash(cm);
        }
    }

    render() {
        const { hashPrefix } = this.state;
        const { mdeValue } = this.props;
        const { uniqueId } = this;
        return (
            <div className="markdown">
                <SimpleMDE
                    onChange={this.handleChange}
                    value={mdeValue}
                    options={{
                        spellChecker: false,
                        autosave: {
                            enabled: true,
                            uniqueId: uniqueId,
                            delay: 1000
                        }
                    }}
                    events={{
                        'inputRead': this.detachSpecialChar,
                        'focus': this.closePopUps,
                        'keyup': this.handlePrefix,
                        // 'blur': this.handleBlur
                    }}
                    getMdeInstance={this.setMdeInstance}
                    // extraKeys={this.addExtraKeys}
                />
                <AtUserPopUp
                    setSelectedUser={this.setSelectedUser}
                />
                <HashTagPopUp hashPrefix={hashPrefix}
                              setSelectedHashTag={this.setSelectedHashTag}
                              endDetectedHash={this.endDetectedHash}/>
            </div>
        );
    }

    // addExtraKeys = {
    //     'Shift-2': function(cm) {
    //         cm.replaceSelection('@');
    //     }
    // }
}

export default MarkdownEditor;