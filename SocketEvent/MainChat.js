
const db = require('../Database/index')

module.exports = function(io){

    // socket format
    // channel:channelName:action:otherUserDataOrOther

    const joinToMainChannel = async function(payload){
        const socket = this;
        socket.join('main-lobby');
        socket.data.user = payload

        socket.emit('channel:main:meJoined' , {
            message: 'joined to main channel!',
        });

        await db.users.update({
            is_online : true
        } , {
            where : {
                id : payload.id
            }
        })

        // let other users in the main channel know that a new user has joined
        socket.broadcast.to('main-lobby').emit('channel:main:userJoined' , {
            message: 'a new user has joined the main channel!',
            userId : payload.id
        });

        // let other users know that the user has left the main channel
        socket.on('disconnect' , async () => {
            socket.broadcast.to('main-lobby').emit('channel:main:userLeft' , {
                message: 'a user has left the main channel!',
                userId : socket.data.user.id
            });

            await db.users.update({
                is_online : false
            } , {
                where : {
                    id : socket.data.user.id
                }
            })

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