import React, {Component} from 'react';
import './Messenger.scss';
import AddContact from "../AddContact/AddContact";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as AddChatSVG} from "../assets/add-chat.svg";
import { ReactComponent as BackSVG} from "../assets/back.svg";
import MessageBox from "../MessageBox/MessageBox";

class Messenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addChatShown: true,
            currentChatRooms: [],
            selectedReceiver: null
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
        this.setState({
            selectedReceiver: user
        });
    }

    render() {
        const { addChatShown, selectedReceiver } = this.state;
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
                    {
                        selectedReceiver &&
                        <MessageBox
                            selectedReceiver={selectedReceiver}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Messenger;