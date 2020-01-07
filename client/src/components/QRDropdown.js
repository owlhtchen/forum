import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
var QRCode = require('qrcode.react');

export default class QRDropdown extends Component {
  render() {
    let url = window.location.href;
    return (
    <Dropdown  className="d-inline">
      <Dropdown.Toggle  className="bg-white text-dark border-0" id="dropdown-basic">
        Share QR Code
      </Dropdown.Toggle>

      <Dropdown.Menu >
        <QRCode value={url} />
      </Dropdown.Menu>
    </Dropdown>
    )
  }
}
