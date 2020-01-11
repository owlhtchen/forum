import React, { Component } from 'react'
import axios from 'axios'

export default class UploadImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: null
		};
	}

	handleSubmit = async (e) => {
		let formData = new FormData();
		formData.append('userAvatar', this.state.file);
		const config = {
			'header': {
				'content-type': "multipart/form-data"
			}
		};
		await axios.post('/upload/avatar', formData, config);
	}

	handleChoose = (e) => {
		this.setState({
			file: e.target.files[0]
		});
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<fieldset>
						<label htmlFor="user-avatar">Choose avatar: &nbsp;</label>
						<input type="file" onChange={this.handleChoose} name="user-avatar"></input>
						<button>Upload</button>
					</fieldset>
				</form>				
			</div>
		)
	}
}
