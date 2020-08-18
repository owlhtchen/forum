const Chatroom = require('./models/chatroom');
const { getChatRoomName } = require('./controllers/chatroom');
const { addChatMessage } = require('./controllers/chatroom');
const {getNewbiesInChatRoom} = require("./controllers/chatroom");

module.exports = (io) => {
    let module = {};

    io.on('connection', function (socket) {

        socket.on("room", ({ chatRoomName, firstID, secondID }) => {
            socket.join(chatRoomName);
        });

        socket.on("notification-room", (userID) => {
            socket.join(userID);
        })

        socket.on("new message", async (data) => {
            let foundChat = await addChatMessage(data.senderID, data.receiverID, data.content);
            let history = foundChat.history;
            let lastMessage = history[history.length - 1];
            let newbies = getNewbiesInChatRoom(foundChat);
            for(const newbie of newbies) {
                io.in(newbie).emit('refresh');
            }

            const chatRoomName = getChatRoomName(data.senderID, data.receiverID);
            socket.broadcast.to(chatRoomName).emit('new message', lastMessage);
            socket.emit('new message', lastMessage);
        })
    })

    return module;
}