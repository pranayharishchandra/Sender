import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {

	const [loading, setLoading]             = useState(false);
	const [conversations, setConversations] = useState([]);


	//! *** useEffect should be used when data fetching should be done automatocaly to update the dom when ever the page loads

	useEffect(() => {

		const getConversations = async () => {

			setLoading(true);

			try {
				
				//! conversations = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
				const res  = await fetch("/api/users"); //* list of all users with thier information other than their passwords
				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			}
			catch (error) {
				toast.error(error.message);
			} 
			finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;


/*
* useEffect should be used when data fetching should be done automatocaly to update the dom when ever the page loads

1. Automatic Execution on Mount:
2. Conditional Execution Based on Dependencies
3. Separation of Concerns: Using useEffect for data fetching helps keep the asynchronous data fetching logic separate from the UI rendering logic. This separation makes your component cleaner, easier to maintain, and avoids potential issues like infinite loops or excessive data fetching.
4. Updating the DOM
*/