import React, {Component} from 'react';
import './Messenger.scss';
import AddContact from "../AddContact/AddContact";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as AddChatSVG} from "../assets/add-chat.svg";
import { ReactComponent as BackSVG} from "../assets/back.svg";
import MessageBox from "../MessageBox/MessageBox";
import CurrentContact from "../CurrentContact/CurrentContact";
import { connect } from 'react-redux';
import {getCurrentContact} from "../../utils/chatroom";
import {getChatRoomName} from "../../utils/user";
import io from 'socket.io-client/dist/socket.io.js';

class Messenger extends Component {

    constructor(props) {
        super(props);
        let socket =  io();
        this.state = {
            socket: socket,
            addChatShown: false,
            currentChatRooms: [],
            selectedReceiver: null,
            chatRecords: null
        }
    }

    async componentDidMount() {
        if(this.props.location.state) {
            const { selectedReceiver } = this.props.location.state;
            if(selectedReceiver) {
                this.setState({
                    selectedReceiver
                })
            }
        }
        let chatRecords = await this.fetchChatRecords();
        this.joinChatRooms(chatRecords);
        this.setState({
            chatRecords
        })
    }

    componentWillUnmount() {
        let { socket } = this.state;
        if(socket) {
            socket.disconnect();
        }
    }

    toggleAddChat = () => {
        const prev = this.state.addChatShown;
        this.setState({
            addChatShown: !prev
        })
    }

    setSelectedUser = async (user) => {
        this.setState({
            selectedReceiver: null
        }, () => {
            this.setState({
                selectedReceiver: user
            });
        });
    }

    fetchChatRecords = async () => {
        const { userID } = this.props;
        let chatRecords = await getCurrentContact(userID);
        chatRecords = chatRecords.sort((record1, record2) => {
            if(record1.unreadMsg !== record2.unreadMsg) {
                return - (record1.unreadMsg - record2.unreadMsg);
            } else {
                let lastMsg1 = record1.history.slice(-1)[0];
                let lastMsg2 = record2.history.slice(-1)[0];
                if(lastMsg1 && lastMsg2) {
                    return - (lastMsg1.time - lastMsg2.time);
                } else {
                    return 0;
                }
            }
        })
        // console.log(chatRecords);
        return  chatRecords;
    }

    joinChatRooms = (chatRecords) => {
        let { socket } = this.state;
        chatRecords.forEach((chatRecord) => {
            const { firstID, secondID } = chatRecord;
            let chatRoomName = getChatRoomName(firstID, secondID);
            socket.emit("room", chatRoomName);
        });
    }

    render() {
        const { addChatShown, selectedReceiver, chatRecords, socket } = this.state;
        let content = addChatShown ? (
            <AddContact
                setSelectedUser={this.setSelectedUser}
            />
        ) : (
          chatRecords && <CurrentContact
            setSelectedUser={this.setSelectedUser}
            chatRecords={chatRecords}
            socket={socket}
          />
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
                            socket={socket}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.user.userID
    };
}

export default connect(mapStateToProps)(Messenger);