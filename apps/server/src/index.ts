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
            queue.push(socket.id);
            if (queue.length >= 2) {
                const venter = queue.shift()!;
                const listener = queue.shift()!;
                const roomId = `${venter}#${listener}`;
                io.to(venter).emit('paired', { roomId, role: 'venter' });
                io.to(listener).emit('paired', { roomId, role: 'listener' });
                socket.join(roomId);
                io.sockets.sockets.get(venter)?.join(roomId);
            }
        });

        // When a message is sent
        socket.on('message', ({ roomId, message }) => {
            io.to(roomId).emit('message', message);
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            queue = queue.filter(id => id !== socket.id);
            const roomId = Object.keys(socket.rooms).find(room => room.includes(socket.id));
            if (roomId) {
                socket.to(roomId).emit('disconnected');
            }
        });
    });

    httpServer.listen(Port, () => {
        console.log(`HTTP server created at ${Port}`);
    });
}

init();
