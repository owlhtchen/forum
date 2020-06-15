import React, {Component} from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

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

    addExtraKeys = {
        'Shift-2': function(cm) {
            cm.replaceSelection('@');
        }
    }

    render() {
        const { value } = this.state;
        const { uniqueId } = this;
        return (
            <div>
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
                    extraKeys={this.addExtraKeys}
                />;
            </div>
        );
    }
}

export default MarkdownEditor;