let SocketUserMap = {};

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

        SocketUserMap[payload.id] = {
            socketId : socket.id,
            userData : payload
        }

        // update user status as online
        // let updateValues = { name: 'changed name' };
        // models.Model.update(updateValues, { where: { id: 1 } }).then((result) => {
        //     // here your result is simply an array with number of affected rows
        //     console.log(result);
        //     // [ 1 ]
        // });

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

            delete SocketUserMap[socket.data.user.id]

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