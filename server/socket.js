module.exports = (io) => {
  var module = {};

  io.on('connection', function(socket) {
    console.log('connected socket');
  })

  return module;
}