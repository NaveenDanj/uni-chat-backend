
module.exports = function(io){

    const sendToMainChannel = function(payload){
        const socket = this;
        let _payload = payload;
        _payload.id = Date.now()+'' + socket.id;

        socket.broadcast.to('main-lobby').emit('channel:main:receiveMessage' , _payload);
    }

    const joinPrivateConversation = function(contact){
        const socket = this;

        // check if the user is already in the conversation
        if(!socket.rooms.has(contact.room_id)){

            socket.join(contact.room_id);
        
            socket.emit('private:joined' , {
                message: 'joined to private conversation!',
                room : contact.room_id
            });

        }
        
    }

    const sendPrivateMessage = function(payload){
        const socket = this;
    }

    return {
        joinPrivateConversation,
        sendPrivateMessage
    }


}