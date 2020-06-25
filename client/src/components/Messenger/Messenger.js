import React, {Component} from 'react';
import './Messenger.scss';
import AddContact from "./AddContact";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as AddChatSVG} from "../assets/add-chat.svg";
import { ReactComponent as BackSVG} from "../assets/back.svg";

class Messenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addChatShown: false
        }
    }

    toggleAddChat = () => {
        const prev = this.state.addChatShown;
        this.setState({
            addChatShown: !prev
        })
    }

    setSelectedUser = async (user) => {
        console.log(user);
    }

    render() {
        const { addChatShown } = this.state;
        let content = addChatShown ? (
            <AddContact
                setSelectedUser={this.setSelectedUser}
            />
        ) : (
          <div>Placeholder</div>
        );
        return (
            <div className="messenger">
                <div className="messenger__contacts">
                    <SVGIcon
                        width={"3.5rem"}
                        tooltip="add new chat"
                        onClick={this.toggleAddChat}
                    >
                        {addChatShown? <BackSVG /> : <AddChatSVG />}
                    </SVGIcon>
                    {content}
                </div>
                <div className="messenger__messages">

                </div>
            </div>
        );
    }
}

export default Messenger;