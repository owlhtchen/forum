const Chatroom = require('./models/chatroom');
const { getChatRoomName } = require('./utils/helpers');
const { addChatMessage } = require('./utils/chat');

module.exports = (io) => {
    let module = {};

    io.on('connection', function (socket) {

        socket.on("room", (room) => {
            console.log("joined ", room);
            socket.join(room);
        });

        socket.on("new message", async (data) => {
            if(true) {
                // for testing
                console.log(data);
                socket.broadcast.emit('new message', {
                    data
                });
                return;
            }

            await addChatMessage(data.senderID, data.receiverID, data.content);

            const chatRoomName = getChatRoomName(data.senderID, data.receiverID);
            socket.broadcast.to(chatRoomName).emit('new message', data);
            socket.emit('new message', data);
        })
    })

    return module;
}