/* //* Overall Functionality

- This setup allows for real-time communication between the server and connected clients.
- It can handle events like sending and receiving messages, //* io.to(receiverSocketId).emit("newMessage", newMessage);

								notifying when users connect or disconnect, 
								    and maintaining a list of online users.
*/

//* In essence, "io" is for managing the "server" and "broadcasting" messages, 
//* while "socket" is for managing "individual/perticular" connections and their specific events.

import { Server } from "socket.io";
import http    	  from "http";
import express    from "express";

const app = express(); //* 1. creating express server again (other than server.js)

const server = http.createServer(app); //* 2. creating http server using express app

//* 3. A Socket.IO server is instantiated with the HTTP server and configured for CORS (Cross-Origin Resource Sharing).
const io = new Server(server, {
	cors: {
		// origin: ["http://localhost:3000"], 
		origin: ["https://sender-oiym.onrender.com/"], 
		methods: ["GET", "POST"],
	},
});

 /* //! cors: //* Explanation
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


//! 1. User Socket Map:
export const getReceiverSocketId = (receiverId) => {
	//* A "userSocketMap" object is used to - map user IDs to their respective socket IDs. 
	//* This helps in identifying which socket belongs to which user.
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}


/* //! 2. Connection Event:
 * The server listens for connection events on the Socket.IO server. Each time a client connects, the following occurs:
- The client's socket ID is logged.
- The client's user ID is retrieved from the handshake query. 
If the user ID is valid (not "undefined"), it is added to the userSocketMap.
- An event getOnlineUsers is emitted to all connected clients, sending them the list of currently online user IDs.
 */

/* //*io.on("connection", callback): 
This method is used to register a callback function that will be executed whenever a new client connects to the server. The connection event is a predefined event in Socket.IO, and the server automatically listens for it. */

io.on("connection", (socket) => {

	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;

	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	//* An event "getOnlineUsers" is emitted to all connected clients, sending them the list of currently online user IDs.
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	/* //! 3. Disconnect Event: //* in detail explaination
*The server listens for disconnect events on each client socket. When a client disconnects:
- The disconnection and the client's socket ID are logged.
- The client's user ID is removed from the userSocketMap.
- The updated list of online users is emitted to all connected clients.
 */
	//! 3. Disconnect Event:
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];

		//* The updated list of online users is emitted to all connected clients.
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});

});

export { app, io, server }; //* (1) Express app, (3) the Socket.IO server , and the (2) HTTP server



/* //TODO: REDIS for data storage
redis: https://youtu.be/jgpVdJB2sKQ?t=45
(giant key: value pair) and it works on the ram (very fast) and not disk (like we are doing here)
 */


/* //* socket.off() vs socket.close()
socket.off(): Removes specific event listeners. Use it for cleanup of event listeners.
socket.close(): Closes the WebSocket connection. Use it to completely disconnect from the server.

so i think socket.off would be used more
and .close will be used very very rearly but atleat once like when user changes
ChatGPT
Yes, you are correct. Here’s a more detailed breakdown:
*/

/* //*What Happens Without Cleanup

If you don't close the socket connection in the cleanup function:


* Resource Consumption:
 The socket connection remains open, consuming resources on both the client and server.

*  Multiple Connections:
 Re-running the useEffect without closing previous connections can result in multiple open connections, leading to duplicated event handling and increased server load.

*  Memory Leaks:
 Unclosed connections can cause memory leaks, as the resources tied to these connections are not released. */

/*   //* io vs socket
* io (Server-Side) - "SocketContext.jsx"
io is an instance of the Socket.IO server, which is created on the server side. It is used to set up and manage the WebSocket server, handle incoming connections, and broadcast messages to all or specific connected clients.

Key Points:
Server-Side: It’s used on the server.
Initialization: You initialize it once with the HTTP server.
Broadcasting: It can be used to broadcast messages to all connected clients or to specific rooms.

? Example Server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

	io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});


* socket (Client-Side and Server-Side) - "socket.js"
socket is an instance of the individual WebSocket connection between the client and the server. It is used to handle events and data transfer on a per-connection basis.

Key Points:
Client-Side and Server-Side: It’s used on both the client and server.
Individual  Connection     : Represents a single connection between the client and server.
Event       Handling       : It’s used to handle specific events and messages for this connection.

? Client-Side Example:
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("newMessage", (message) => {
    console.log("new message from client:", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});


 */




