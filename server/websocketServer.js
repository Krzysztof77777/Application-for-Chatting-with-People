import http from 'http';
import {
    Server
} from 'socket.io';

const startWebsocketServer = (app, PORT) => {
    const server = http.createServer(app);

    server.listen(PORT)

    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.on('message', function (data) {
            var clients = io.sockets;
            switch (data.event) {
                case 'refreshGlobalChat':
                    clients.sockets.forEach(function (client, counter) {
                        if (client.handshake.auth.user !== data.ourObjectID) {
                            client.emit('message', {
                                event: data.event,
                                message: data.message,
                            });
                        }
                    });
                    break;
                case 'refreshChat':
                    clients.sockets.forEach(function (client, counter) {
                        if (data.objectIDFromMessage === client.handshake.auth.user) {
                            client.emit('message', {
                                event: data.event,
                                objectIDFromMessage: data.objectIDFromMessage,
                                message: data.message,
                            });
                        }
                    });
                    break;
                case 'refreshFriendList':
                    clients.sockets.forEach(function (client, counter) {
                        if (data.id === client.handshake.auth.user) {
                            client.emit('message', {
                                event: data.event,
                                action: data.action,
                                id: data.id,
                                ourObjectID: data.ourObjectID,
                            });
                        }
                    });
                    break;
                case 'refreshUserList':
                    clients.sockets.forEach(function (client, counter) {
                        if (data.id === client.handshake.auth.user) {
                            client.emit('message', {
                                event: data.event,
                                action: data.action,
                                id: data.id,
                                ourObjectID: data.ourObjectID,
                            });
                        }
                    });
                    break;
            }
        })
    });
}

export default startWebsocketServer;