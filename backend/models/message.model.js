import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		//? FUTURE DEVELOPMENT: MESSAGE CAN BE FOR GROUP OF PEOPLE, "receiverId" should be an array[] i guess
		senderId: {
			type    : mongoose.Schema.Types.ObjectId, //* _id of User (sending message)
			ref     : "User",
			required: true,
		},
		receiverId: {
			type    : mongoose.Schema.Types.ObjectId,
			ref     : "User",
			required: true,
		},
		message: {
			type    : String,
			required: true,
		},
	},
	// createdAt, updatedAt
	{ timestamps: true }
);
//    model                    collection, schema
const Message = mongoose.model("Message", messageSchema);

export default Message;
