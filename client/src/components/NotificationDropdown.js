import React, { Component, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { dateInfo, getParentPost } from '../utils/index'
import { withRouter } from 'react-router';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        {/* <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={e => setValue(e.target.value)}
          value={value}
        /> */}
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    }
  }

  getNotifications = async () => {
    const { userID } = this.props;
    let res = await axios.get('/users/get-notifications/' + userID);
    this.setState({
      notifications: res.data.reverse()
    });
  }

  redirectToPost = async (postID) => {
    const parentID = await getParentPost(postID);
    console.log(parentID);
    this.props.history.push('/posts/view-post/' + parentID);
  }

  render() {
    return (
      <Dropdown onClick={this.getNotifications}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          Notification
        </Dropdown.Toggle>
    
        <Dropdown.Menu as={CustomMenu}>
          {
            this.state.notifications.map((notification, index) => {
              return (
                <Dropdown.Item onClick={() => { this.redirectToPost(notification.postID); }}
                href={"#/action-" + index} key={index}>
                  {notification.content + dateInfo(notification.time)}
                </Dropdown.Item>
              );
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default withRouter(NotificationDropdown);