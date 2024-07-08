import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
											 //* req.user = await User.findById(decoded.userId).select("-password");
		const loggedInUserId = req.user._id;

		// minus sign (-) before "password" is used to exclude that specific field from the results.
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} 
	catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
