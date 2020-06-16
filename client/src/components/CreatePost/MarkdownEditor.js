import React, {Component} from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import './MarkdownEditor.scss';
import AtUserPopUp from "./AtUserPopUp";

class MarkdownEditor extends Component {

    uniqueId= "mde-editor-storage";

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            selectedUser: null,
            mdeInstance: null,
            detectedHash: false
        };
    }

    handleChange = (value) => {
        this.setState({
            value
        })
    }

    componentDidMount() {
        const saved = localStorage.getItem(this.uniqueId) || '';
        this.setState({
            value: saved
        });
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
            console.log(url);
            cm.doc.replaceRange(url,
                {line: line, ch: ch -1},
                {line: line, ch: ch});
            cm.focus();
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
        let word = cm.getRange(wordRange.anchor, wordRange.head);
        return word;
    }

    handlePrefix = (cm) => {
        let { line, ch } = cm.getCursor();
        if(ch < 1) {
            return;
        }
        const { detectedHash } = this.state;
        let inputChar = cm.doc.getLine(line).charAt(ch - 1);
        if(detectedHash && (/\s/.test(inputChar))) {
            this.setState({
                detectedHash: false
            })
            return;
        } else if(inputChar === '#') {
            return;
        } else if(detectedHash) {
                let prefix = this.getHashPrefix(cm);
                console.log(prefix);
                return;
        }
    }

    detachSpecialChar = (cm) => {
        let { line, ch } = cm.getCursor();
        if(ch < 1) {
            return;
        }
        const { detectedHash } = this.state;
        let inputChar = cm.doc.getLine(line).charAt(ch - 1);
        // if(detectedHash && (/\s/.test(inputChar))) {
        //     this.setState({
        //         detectedHash: false
        //     })
        //     return;
        // } else if(detectedHash) {
        //     let prefix = this.getHashPrefix(cm);
        //     console.log(prefix);
        //     return;
        // }

        if(inputChar === '@') {
            this.showAtUserPopUp(cm);
        } else if(inputChar === '#') {
            this.setState({
                detectedHash: true
            });
        }
    }

    render() {
        const { value } = this.state;
        const { uniqueId } = this;
        return (
            <div className="markdown">
                <SimpleMDE
                    onChange={this.handleChange}
                    value={value}
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
                        'keyup': this.handlePrefix
                    }}
                    getMdeInstance={this.setMdeInstance}
                    // extraKeys={this.addExtraKeys}
                />
                <AtUserPopUp
                    setSelectedUser={this.setSelectedUser}
                />
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