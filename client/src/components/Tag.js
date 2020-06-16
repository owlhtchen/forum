import React, {Component} from 'react'
import axios from 'axios'
// import SearchCategory from './SearchCategory';

export default class Tag extends Component {
    addTag = async () => {
        try {
            const name = document.getElementById('tag').value;
            await axios.post('/tags/add-tag', {
                name: name
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    render() {
        return (
            <form className="mt-3" onSubmit={this.addTag}>
                <fieldset>
                    <label htmlFor="tag">Tag&nbsp;</label>
                    <input id="tag"></input>
                </fieldset>
                <button>Add</button>
            </form>
        )
    }
}
