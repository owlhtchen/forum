const Chatroom = require('./models/chatroom');
const { getChatRoomName } = require('./controllers/chatroom');
const { addChatMessage } = require('./controllers/chatroom');

module.exports = (io) => {
    let module = {};

    io.on('connection', function (socket) {

        socket.on("room", (room) => {
            socket.join(room);
        });

        socket.on("new message", async (data) => {
            let foundChat = await addChatMessage(data.senderID, data.receiverID, data.content);
            let history = foundChat.history;
            let lastMessage = history[history.length - 1];

            const chatRoomName = getChatRoomName(data.senderID, data.receiverID);
            socket.broadcast.to(chatRoomName).emit('new message', lastMessage);
            socket.emit('new message', lastMessage);
        })
    })

    return module;
}