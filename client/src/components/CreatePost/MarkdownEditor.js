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
            mdeInstance: null
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
        }
    }

    setMdeInstance = (mdeInstance) => {
        this.setState({
            mdeInstance: mdeInstance
        });
    }

    detectAt = (cm) => {
        let { line, ch } = cm.getCursor();
        if(ch < 1) {
            return;
        }
        let namePopUp = document.querySelector(".markdown__popup");
        let nameInput = namePopUp.querySelector(".markdown__input");
        let inputChar = cm.doc.getLine(line).charAt(ch - 1);
        if(inputChar === '@') {
            let {left, top} = cm.cursorCoords(true, "window");
            namePopUp.style.left = (4 + left) + 'px';
            namePopUp.style.top = top + 'px';
            namePopUp.style.display = 'block';
            setTimeout(() => {
                // a hack from: https://stackoverflow.com/questions/30018357/override-autofocus-attribute-with-javascript-jquery
                nameInput.focus();
                nameInput.select();
            }, 120);
        } else {
            namePopUp.style.display = "none";
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
                        autofocus: false,
                        spellChecker: false,
                        autosave: {
                            enabled: true,
                            uniqueId: uniqueId,
                            delay: 1000
                        }
                    }}
                    events={{
                        'inputRead': this.detectAt
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