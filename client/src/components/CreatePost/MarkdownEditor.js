import React, {Component} from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

class MarkdownEditor extends Component {

    uniqueId= "mde-editor-storage";

    constructor(props) {
        super(props);
        this.state = {
            mdeInstance: null,
            value: ''
        };
    }

    handleChange = () => {
        const { mdeInstance } = this.state;
        console.log(mdeInstance.value());
    }

    getMdeInstance= (mdeInstance) => {
        this.setState({
            mdeInstance
        });
    }

    componentDidMount() {
        const saved = localStorage.getItem(this.uniqueId) || '';
        this.setState({
            value: saved
        });
    }

    render() {
        const { value } = this.state;
        const { uniqueId } = this;
        return (
            <div>
                <SimpleMDE
                    onChange={this.handleChange}
                    getMdeInstance={this.getMdeInstance}
                    value={value}
                    options={{
                        autosave: {
                            enabled: true,
                            uniqueId: uniqueId,
                            delay: 3000
                        }
                    }}
                />;
            </div>
        );
    }
}

export default MarkdownEditor;