import { Server } from "socket.io";
import http    	  from "http";
import express    from "express";

const app = express();

const server = http.createServer(app);


const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], 
		methods: ["GET", "POST"],
	},
});

/*
* cors: 
This is an option within the Socket.IO server configuration that specifies how the server should handle CORS requests. CORS is a security feature that restricts web applications from making requests to a domain different from the one that served the initial web page.

* origin: ["http://localhost:3000"]: 
This setting specifies which origins are allowed to connect to the Socket.IO server. In this case, only web pages served from http://localhost:3000 are permitted to establish a connection. This is useful during development to restrict access to your server to specific front-end applications.


* methods: ["GET", "POST"],
HTTP methods that are allowed when accessing the server. For Socket.IO, this typically involves initial HTTP handshake requests that can upgrade to WebSocket connections.

! IN PRODUCTION: ===========================================
* Single URL: 
If both your frontend and backend are served from the same domain and port (i.e., they are on the same origin), then CORS issues typically do not arise. 
*This is because requests from the frontend to the backend are considered same-origin, which do not trigger CORS restrictions.

*Separate URLs: 
If your frontend and backend are served from different domains, subdomains, ports, or protocols, they are considered different origins. In such cases, you will still need to configure CORS settings to allow your frontend to communicate with your backend.

 */
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}


io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
