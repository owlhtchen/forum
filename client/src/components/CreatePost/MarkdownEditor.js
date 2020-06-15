import React, {Component} from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import './MarkdownEditor.scss';

class MarkdownEditor extends Component {

    uniqueId= "mde-editor-storage";

    constructor(props) {
        super(props);
        this.state = {
            value: ''
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

    detectAt = (cm) => {
        let { line, ch } = cm.getCursor();
        let namePopUp = document.querySelector(".markdown__popup");
        let input_ch = cm.doc.getLine(line).charAt(ch - 1);
        if(input_ch === '@') {
            // cm.doc.replaceRange('[you type @]', {line, ch});
            let {left, top} = cm.cursorCoords(true, "window");
            namePopUp.style.left = left + 'px';
            namePopUp.style.top = top + 'px';
            namePopUp.style.display = 'block';
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
                        autosave: {
                            enabled: true,
                            uniqueId: uniqueId,
                            delay: 1000
                        }
                    }}
                    // extraKeys={this.addExtraKeys}
                    events={{
                        'cursorActivity': this.detectAt
                    }}
                />
                <div className="markdown__popup">
                    <span>You typed @</span>
                </div>
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