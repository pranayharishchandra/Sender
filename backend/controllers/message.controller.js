import Conversation from "../models/conversation.model.js";
import Message      from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";



//? Error in sendMessage controller:  Message validation failed: message: Path `message` is required.

export const sendMessage = async (req, res) => {
	try {
		const { message }        = req.body;
		const { id: receiverId } = req.params;    //* extract id and rename as receiver
		const senderId           = req.user._id;  //* (cookie) req.user._id middleware "protectedRoute"

		// console.log("senderId : ", senderId)

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

		//! SHOULD ADD CONDITION IF MESSAGE EXISTED
		if (!newMessage) {
			return res.status(400).json({ error: "Message content is required." });
		}

		//* after creating the message for the conversation
		//* push the message document in conversation document
		//! messages is an array refering to the messages
		if (newMessage) {
/* 
* 1. Reference Storage:
 The conversation.messages array does not store the entire newMessage object. Instead, it stores only the _id of the newMessage. 
 - This is a common practice in MongoDB to 
 *avoid duplication of data and to keep the document sizes small. 
 The actual message data is stored in the Message collection.

* 2. No await Needed:
 The push operation on an array in JavaScript is synchronous and does not return a Promise.

*/
			conversation.messages.push(newMessage._id); //! don't store message but reference to 
		}

		// console.log("newMessage: ", newMessage)

		await conversation.save();
		await   newMessage.save();

		// this will run in parallel
		// await Promise.all([conversation.save(), newMessage.save()]);

		//* SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		
		if (receiverSocketId) {
			//! io.to(<socket_id>).emit() -> used to send events to specific client
			// io.to(receiverSocketId).emit("newMessage", newMessage);
			io.to(receiverSocketId).emit("newMessage", { ...newMessage, conversationId: conversation._id});
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
		const { id: userToChatId } = req.params;   //* 2nd person in the conversation / reciever
		const senderId             = req.user._id; //* current userId (cookie)

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); //? NOT REFERENCE BUT ACTUAL MESSAGES

		//! if there was no conversation between the current (cookie) user and the other 2nd user, return "empty array[]", means no messages
		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} 
	catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/* //! getMessages - //* output

* const conversation = await Conversation.findOne({
  	participants: { $all: [senderId, userToChatId] },
* }).populate("messages");

* const messages = conversation.messages;

! console.log(messages) // array of messages (objects)
[
    {
        "_id"       : "668c12c5816d890749a7804f",
        "senderId"  : "668a8ae5860678f7c3265cd4",
        "receiverId": "668a9d949f009f7cbb266de5",
        "message"   : "hello Anand ji by Pranay",
        "createdAt" : "2024-07-08T16:24:38.120Z",
        "updatedAt" : "2024-07-08T16:24:38.120Z",
        "__v"       : 0
    },
    {
        "_id"       : "668c16a78e7e6b07602ddde7",
        "senderId"  : "668a8ae5860678f7c3265cd4",
        "receiverId": "668a9d949f009f7cbb266de5",
        "message"   : "message2: hello Anand ji by Pranay",
        "createdAt" : "2024-07-08T16:41:11.954Z",
        "updatedAt" : "2024-07-08T16:41:11.954Z",
        "__v": 0
    }
]
 */

/* //! 	io.to(receiverSocketId).emit("newMessage", newMessage); //* EXPLAINATION

* 1) Socket.IO Instance (io):
 This is the instance of Socket.IO server. It manages all the sockets connected to it.

* 2)  ****************** .to(receiverSocketId): ******************
 This method targets a specific client (socket) by its unique socket ID (receiverSocketId). 
 This ID is typically assigned to a client when they connect to the Socket.IO server.

* 3) ****************** .emit("newMessage", newMessage): ******************
 This method sends an "event" named "newMessage" to the targeted client. 
 The second argument, "newMessage", is the "data (object)" being sent with the event. 
 In this context, newMessage likely contains details about a message that was just sent in a chat application, 
 such as the sender, the message content, and possibly timestamps.

* Purpose
The purpose of this code is to instantly inform a client (receiver) that a new message has been sent to them, 
enabling real-time communication features in applications like chat services. 
This avoids the need for the client to continuously check (poll) the server for new messages.
*/