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
			const socket = io("http://localhost:5001", { //! change here
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} 
		else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

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