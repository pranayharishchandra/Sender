import { useState }			  from "react";
import { useAuthContext } from "../context/AuthContext";
import toast						  from "react-hot-toast";

const useLogout = () => {

	const [loading, setLoading] = useState(false);
	const { setAuthUser }       = useAuthContext();


	//* logout funciton is the hook
	//* don't use "useEffect" because this funciton will not be automatically called (like on page refresh), but only be called when the user clicks the "logout" button
	const logout = async () => {

		setLoading(true); // since calling backend (time consuming operations)

		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			const data = await res.json(); // reponse from backend

			// 	res.status(400).json({ error: "Invalid user data" });
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user"); //* we can remove from localstorege unlike cookie we could only expire
			setAuthUser(null);
		} 
		catch (error) {
			toast.error(error.message);
		} 
		finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
