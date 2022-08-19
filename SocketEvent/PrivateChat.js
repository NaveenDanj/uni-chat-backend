const db = require('../Database');

module.exports = function(io){

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

    const sendPrivateMessage = async function(payload){
        
        const socket = this;

        let message_object = {
            message: payload.message,
            user_from: payload.user_from,
            user_to: payload.user_to,
            date : new Date(),
            room_id: payload.room_id
        }
        
        let msg = await db.chat.create({
            from_user_id: payload.user_from.id,
            to_user_id: payload.user_to.user.id,
            message_type : 'text',
            send_to: 'private',
            message : payload.message,
            is_read: false,
        });

        message_object.id = msg.id;

        socket.broadcast.to(payload.room_id).emit('private:receiveMessage' , message_object);

    }

    const readPrivateMessage = async function(payload){
        const socket = this;
        
        let messages = payload.messages;
        let room = payload.room_id;
        let from = payload.from;
        let to = payload.to;

        // update the messages to read
        for(let i = 0; i < messages.length; i++){

            let message = messages[i];

            await db.chat.update({
                is_read: true
            } , {
                where : {
                    id : message.id
                }
            });

        }

        socket.broadcast.to(payload.room_id).emit('private:readReceipt' , message_object);

    }

    return {
        joinPrivateConversation,
        sendPrivateMessage,
        readPrivateMessage
    }


}