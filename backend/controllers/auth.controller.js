import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		  // HASH PASSWORD HERE
		const salt           = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		  // https://avatar-placeholder.iran.liara.run/

		  // * I didn't wanted to use "multer" for image upload, so i am using links for image (online hosted images)
		  // random boy pic: https://avatar.iran.liara.run/public/boy
		  // to make it a perticular, add username
		const boyProfilePic  = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  /*
* const newUser = new User({
-	is not directly creating a document in the database. Instead, it is 
*creating an instance of the User model with the specified properties (fullName, username,
 password, gender, profilePic). This instance (newUser) holds the data in memory and prepares it for insertion into the database.
- The actual creation of the document in the MongoDB database occurs when you call: 
* await newUser.save();
 */
		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			  // Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id       : newUser._id,
				fullName  : newUser.fullName,
				username  : newUser.username,
				profilePic: newUser.profilePic,
			});
		} 
		else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} 
	catch (error) {
		console.log("Error in signup controller: ", error.message);
		  // error.message: "Error in signup controller secretOrPrivateKey must have a value"
		res.status(500).json({ error: "auth.controller.js - signup - Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user                   = await User.findOne({ username });
		const isPasswordCorrect      = await bcrypt.compare(password, user?.password || ""); // if there was no user with that username, password will be ("")

		// we don't want to let them know if username was wrong or the password
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id       : user._id,
			fullName  : user.fullName,
			username  : user.username,
			profilePic: user.profilePic,
		});
	} 
	catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		// common practice: It sets the cookie named "jwt" to an empty string and sets its maximum age to 0, effectively expiring it immediately
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} 
	catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/*
? - throwing erorr is only done in frontend, (as it's used by toast)
? - in backend "res.status(500).json({ error: "error message" });"
 */