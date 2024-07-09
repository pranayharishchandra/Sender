import mongoose from "mongoose";

// TODO: make a group like you make of people 

const conversationSchema = new mongoose.Schema(
	{
		//* array []: group of participants - (sender & reciver) - (participant1 and participant2)
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId, //* _id of User in the conversation
				ref : "User",
			},
		],
		messages: [
			{
				type   : mongoose.Schema.Types.ObjectId,
				ref    : "Message",
				default: [], // default: [] is not mandatory, it is often recommended to include it for arrays in your schemas to ensure consistency and simplify application logic.
			},
		],
	},
	{ timestamps: true } //* for the mongoDB
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

/*
* "ref"

* Necessity: optional to use
If you never intend to use Mongoose's populate feature to join documents across collections, technically, you could omit ref. However, this would limit your schema's flexibility and the richness of your data interactions.

* Best Practice: 
Including ref is recommended as it enhances the schema's expressiveness and utility, making your data model more robust and maintainable.
 */