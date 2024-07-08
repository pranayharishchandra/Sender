import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type    : String,
			required: true,
		},
		username: {
			type    : String,
			required: true,
			unique  : true,     // username must be unique
		},
		password: {
			type     : String,
			required : true,
			minlength: 6,
		},
		gender: {
			type    : String,
			required: true,
			enum    : ["male", "female"],
		},
		profilePic: {
			type   : String,
			default: "",
		},
	},
	// createdAt, updatedAt => Member since <createdAt>
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

/*
* EXAMPLE
{
	_id       : 668a8ae5860678f7c3265cd4,
	fullName  : "Pranay Harishchandra",
	username  : "pranay",
	password  : "$2a$10$32TRo/sWyQtJWIKqzYXnb.br3NLGV6gZT4rzy5kwsWQ2a7sXpuBA.",
	gender    : "male",
	profilePic: "https://avatar.iran.liara.run/public/boy?username=pranay",
	createdAt : 2024-07-07T12: 32: 37.033+00: 00,
	updatedAt : 2024-07-07T12: 32: 37.033+00: 00,
	__v       : 0,
}
*/