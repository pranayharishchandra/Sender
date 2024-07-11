import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {

	const [loading, setLoading] = useState(false);
	const { setAuthUser }       = useAuthContext();

	//! signup function
	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {

		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });

		if (!success) return;

		//* loading become "true" now because now the backend operations will be performed (which will take time)
		setLoading(true);

		try {
/*
! USING "FETCH" METHOD: WE ARE SENDING DATA TO BACKEND - "AUTH.CONTROLLER.JS"
* const { fullName, username, password, confirmPassword, gender } = req.body;
! THEN BACKEND WILL SEND DATA TO FRONTEND, i.e. response or "res" which is
 if (newUser) {
 	
 	generateTokenAndSetCookie(newUser._id, res);
 	await newUser.save();
 
* 	res.status(201).json({
 		_id       : newUser._id,
 		fullName  : newUser.fullName,
 		username  : newUser.username,
 		profilePic: newUser.profilePic,
 	});
 } 
 else {
* 	res.status(400).json({ error: "Invalid user data" });
 }
*/
			const res = await fetch("/api/auth/signup", {
				method : "POST",
				headers: { "Content-Type": "application/json" },
				body   : JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			//* raw json data was fetched.. change it into javascript object
			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));

			setAuthUser(data);
		} 
		catch (error) {
			toast.error(error.message);
		} 
		// pass or fail -> loading must be stopped after a result
		finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignup;

//* all fields must be present, password must be matching with lenght more than 6 as it's mendetory in the backend
function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {

	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
