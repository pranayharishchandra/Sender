import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io 								from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {

	const [socket, setSocket]           = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser }                  = useAuthContext();

	//* useEffect since we want to change the DOM automatically
	useEffect(() => {

		if (authUser) {
			// Create a new socket instance
			// const localSocket = io("http://localhost:5001", { // Renamed to localSocket
			const localSocket = io("https://sender-oiym.onrender.com/", { // Renamed to localSocket
				query: {
					userId: authUser._id,
				},
			});

			setSocket(localSocket); // Update state with the new socket instance

			//* Listen for the "getOnlineUsers" event, (on means listening to that event)
			//! don't use "socket.on" because This will cause issues because the socket state might not be updated immediately.
			localSocket.on("getOnlineUsers", (users) => { 
				//* io.emit("getOnlineUsers", Object.keys(userSocketMap));
				setOnlineUsers(users);
			});

			//* Cleanup function to close the socket when component unmounts or authUser changes
			//* If authUser changes, the cleanup function will run first, closing the previous socket connection before creating a new one.
			
/** //? UNMOUNT MEANING
(1) route change kro 
(2) dependency me change ho useEffect ( callback, [authUser] )
(3) tab ko band kr do  */
			return () => localSocket.close();
		} 
		else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, socket]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>	 {children} 	</SocketContext.Provider>;
};

/*
* Code

const socket = io("http://localhost:5001", { //! change here
	query: {
		userId: authUser._id,
	},
});

This snippet is part of the SocketContextProvider component in a React context for managing "WebSocket" connections with socket.io. 
This specific line highlighted initializes a new WebSocket connection:

* const socket = io("http://localhost:5001", {...}): 
This line creates a new socket connection to the server at http://localhost:5001.

* query:
 An object that contains data to be sent as a query string with the WebSocket connection request.

* userId: authUser._id: 
This sends the user's ID (authUser._id) as part of the query string, likely used by the server to identify the user and manage connections or data accordingly.

*/