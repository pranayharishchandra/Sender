import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//* you could use asyncHandler to avoid try-catch
const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		//* since the JWT contains information about the user i.e. USER_ID, if it's not set, then we can't let them access "protected route"
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		//* TensenMart - authMiddleware.js - store in req.user field, otherwise you will have to router.route(':/id'), req.params.id 
		req.user = user;

		next();
	} 
	catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
