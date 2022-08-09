// const onConnection = (socket) => {
//     // socket.on("order:create", createOrder);
//     // socket.on("order:read", readOrder);

//     // socket.on("user:update-password", updatePassword);
//     console.log('client connected!');
// }

// module.exports = onConnection;


module.exports = function(io){

    const {joinToMainChannel , sendToMainChannel} = require('../SocketEvent/MainChat')(io);


    const onConnection = function(socket){
        console.log('client connected with socket id => ' , socket.id);
        socket.on("chennel:main:sendMessage" , sendToMainChannel);
        socket.on("channel:main:join" , joinToMainChannel);
    }

    return {
        onConnection,
    }

}