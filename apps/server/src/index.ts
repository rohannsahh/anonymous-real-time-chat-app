import http from 'http';
import { Server } from 'socket.io';

async function init() {
    const httpServer = http.createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    const Port = process.env.PORT ? process.env.PORT : 8000;

    let queue: string[] = [];

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // When a user joins the queue
        socket.on('joinQueue', () => {
            console.log(`User ${socket.id} joined the queue`);
            queue.push(socket.id);
            console.log('Current Queue:', queue);

            if (queue.length >= 2) {
                const user1 = queue.shift()!;
                const user2 = queue.shift()!;
                const roomId = `${user1}#${user2}`;

                io.to(user1).emit('paired', { roomId });
                io.to(user2).emit('paired', { roomId });

                io.sockets.sockets.get(user1)?.join(roomId);
                io.sockets.sockets.get(user2)?.join(roomId);

                console.log(`Users ${user1} and ${user2} paired in room ${roomId}`);
            }
        });

        // When a message is sent
        socket.on('message', ({ roomId, message }) => {
            if (roomId && message) { // Ensure roomId and message are not undefined
                console.log(`Message received in room ${roomId}: ${message}`);
                io.to(roomId).emit('message', message);
            }
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            queue = queue.filter(id => id !== socket.id);
            const roomId = Array.from(socket.rooms).find(room => room.includes('#') && room.includes(socket.id));

            if (roomId) {
                socket.to(roomId).emit('disconnected');
                console.log(`User ${socket.id} disconnected from room ${roomId}`);
            }
        });
    });

    httpServer.listen(Port, () => {
        console.log(`HTTP server created at ${Port}`);
    });
}

init();
