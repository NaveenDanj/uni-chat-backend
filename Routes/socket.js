module.exports = function(io){

    const {joinToMainChannel , sendToMainChannel} = require('../SocketEvent/MainChat')(io);
    const {joinPrivateConversation , sendPrivateMessage} = require('../SocketEvent/PrivateChat')(io);

    const onConnection = function(socket){
        socket.on("chennel:main:sendMessage" , sendToMainChannel);
        socket.on("channel:main:join" , joinToMainChannel);

        socket.on("private:join" , joinPrivateConversation);
        socket.on("private:sendMessage" , sendPrivateMessage);
    }

    return {
        onConnection,
    }

}