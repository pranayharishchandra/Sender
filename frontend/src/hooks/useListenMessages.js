import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {

	const { socket }                = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		//! sockect.on don't do directly
/* //* BACKEND > message.controller.js: 
		io.to(receiverSocketId).emit("newMessage", newMessage);
		* new message is sent from BACKEND and recieved here (at FRONTEND)
*/
		socket?.on("newMessage", (newMessage) => {

			newMessage.shouldShake = true; //* UI animation is "Message.jsx"
			const sound            = new Audio(notificationSound);
			sound.play();													  //* 1. play sound

			// message.controller.js: io.to(receiverSocketId).emit("newMessage", { ...newMessage, conversationId: conversation._id});
			if (newMessage.conversationId === selectedConversation?._id){
				setMessages([...messages, newMessage]);
			}

		});

		return () => socket?.off("newMessage");

	}, [socket, setMessages, messages]);
};

export default useListenMessages;
