module.exports = function(io){

    const {joinToMainChannel , sendToMainChannel} = require('../SocketEvent/MainChat')(io);


    const onConnection = function(socket){
        socket.on("chennel:main:sendMessage" , sendToMainChannel);
        socket.on("channel:main:join" , joinToMainChannel);
    }

    return {
        onConnection,
    }

}