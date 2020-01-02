import React, { Component } from 'react'
import Popup from 'reactjs-popup'

export default class MessagePopup extends Component {
  
  render() {
    return (
    <Popup trigger={<button className="button"> Open Modal </button>} modal>
      {close => (
        <div className="react-js-modal">
          <a className="close" onClick={close}>
            &times;
          </a>
          <div className="header"> Username </div>
          <div className="content">
            History
          </div>
          <div className="actions">
            <input placeholder="your message"></input>
            <button
              className="button"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
            >
            Send
            </button>
          </div>
        </div>
      )}
    </Popup>
    )
  }
}
