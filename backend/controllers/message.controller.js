import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message }        = req.body;
		const { id: receiverId } = req.params;    //* extract id and rename as receiver
		const senderId           = req.user._id;  //* req.user._id middleware "protectedRoute"

		//! conversation is a perticular document of the collection Conversation 
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }, // all the "id" in the array (i.e. sender and reciver) should be in participants
		});

		//* if no conversation existed between the users then create one, then send the message
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		//* instance of message created using Model (not saved in the DB now)
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		//* after creating the message for the conversation
		//* push the message document in conversation document
		if (newMessage) {
			conversation.messages.push(newMessage._id); //! this is async 
		}

		// await conversation.save();
		// await   newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		//* SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} 
	catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
