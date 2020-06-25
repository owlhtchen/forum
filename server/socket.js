const Chatroom = require('./models/chatroom');
const { getChatRoomName } = require('./utils/helpers');
const { addChatMessage } = require('./controllers/chatroom');

module.exports = (io) => {
    let module = {};

    io.on('connection', function (socket) {

        socket.on("room", (room) => {
            console.log("joined ", room);
            socket.join(room);
        });

        socket.on("new message", async (data) => {
            let foundChat = await addChatMessage(data.senderID, data.receiverID, data.content);
            let history = foundChat.history;
            let lastMessage = history[history.length - 1];

            const chatRoomName = getChatRoomName(data.senderID, data.receiverID);
            console.log("last msg: ", lastMessage);
            socket.broadcast.to(chatRoomName).emit('new message', lastMessage);
            socket.emit('new message', lastMessage);
        })
    })

    return module;
}