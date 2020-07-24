import React, {Component} from 'react';
import './Messenger.scss';
import AddContact from "../AddContact/AddContact";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ReactComponent as AddChatSVG} from "../assets/add-chat.svg";
import { ReactComponent as BackSVG} from "../assets/back.svg";
import MessageBox from "../MessageBox/MessageBox";
import CurrentContact from "../CurrentContact/CurrentContact";
import { connect } from 'react-redux';

class Messenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addChatShown: false,
            currentChatRooms: [],
            selectedReceiver: null
        }
    }

    componentDidMount() {
        if(this.props.location.state) {
            const { selectedReceiver } = this.props.location.state;
            if(selectedReceiver) {
                this.setState({
                    selectedReceiver
                })
            }
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

    render() {
        const { addChatShown, selectedReceiver } = this.state;
        let content = addChatShown ? (
            <AddContact
                setSelectedUser={this.setSelectedUser}
            />
        ) : (
          <CurrentContact
            setSelectedUser={this.setSelectedUser}
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