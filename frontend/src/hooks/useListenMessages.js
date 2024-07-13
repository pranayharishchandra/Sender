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

			// newMessage.shouldShake = true; //*dded to control some aspect of the UI behavior when a new message is received.
			const sound            = new Audio(notificationSound);
			sound.play();													  //* 1. play sound

			// TODO: newMessage must only be added to reciver, bug now is it's being added to "selectedConversation" which is not necessarly the conversation who sent me the message
			//! (BUG) it should only be added when the message is from the selected conversation
			// message.controller.js: io.to(receiverSocketId).emit("newMessage", { ...newMessage, conversationId: conversation._id});

			if (newMessage.conversationId === selectedConversation?._id)
			setMessages([...messages, newMessage]); //* 2. add the frontend "selectedConversation" 

		});

		return () => socket?.off("newMessage");

	}, [socket, setMessages, messages]);
};

export default useListenMessages;
