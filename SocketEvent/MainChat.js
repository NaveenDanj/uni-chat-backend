let MainRoomSocket = [];

module.exports = function(io){

    // socket format
    // channel:channelName:action:otherUserDataOrOther

    const joinToMainChannel = function(payload){
        const socket = this;
        socket.join('main-lobby');

        socket.emit('channel:main:meJoined' , {
            message: 'joined to main channel!',
        });
        
        // let other users in the main channel know that a new user has joined
        socket.broadcast.to('main-lobby').emit('channel:main:userJoined' , {
            message: 'a new user has joined the main channel!',
        });

        // let other users know that the user has left the main channel
        socket.on('disconnect' , () => {
            socket.broadcast.to('main-lobby').emit('channel:main:userLeft' , {
                message: 'a user has left the main channel!',
            });
        } );

    }

    const sendToMainChannel = function(payload){
        const socket = this;
        let _payload = payload;
        _payload.id = Date.now()+'' + socket.id;

        socket.broadcast.to('main-lobby').emit('channel:main:receiveMessage' , _payload);
    }

    return {
        joinToMainChannel,
        sendToMainChannel
    }
}