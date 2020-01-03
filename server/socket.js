const Chatroom = require('./models/chatroom');

module.exports = (io) => {
  var module = {};

  io.on('connection', function(socket) {
    console.log('connected socket');

    socket.on("room", (room) => {
      socket.join(room);
    });

    socket.on("new message", async (data) => {
      console.log(data);
      let first;
      let second;
      if(data.sender < data.receiver) {
        first = data.sender;
        second = data.receiver;
      } else {
        first = data.receiver;
        second = data.sender;
      }
      let foundUser = await Chatroom.findOne({
        first: first,
        second: second
      });
      if(foundUser) {
        await Chatroom.updateMany(
          {first: first, 
          second: second},
          {
            $push: { history: {
              sender: data.sender,
              content: data.content,
              time: new Date()
            }}
          }
        );
      } else {
          let chatroom = new Chatroom({
          first: first,
          second: second,
          history: [{
            sender: data.sender,
            content: data.content,
            time: new Date()
          }]
        });
        await chatroom.save();
        console.log(chatroom);
      };  // database ends

      socket.broadcast.to(first).emit('new message', data);
      socket.emit('new message', data);
    })
  })

  return module;
}