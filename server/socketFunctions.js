'use strict';

module.exports = {
    // Publishing a event..
  publish: function(socket, options) {
    if (options) {
      console.log('Sending message to front ', options.content);
      socket.emit('message', options);
    } else {
      throw 'Error: Option must be an object type';
    }
  },

};
