import { useEffect, useState } from "react";
import useConversation         from "../zustand/useConversation";
import toast                   from "react-hot-toast";

/**
** useConversations.js (store.js)

const useConversation = create((set) => ({
	//* states - managed by zustand
	selectedConversation   : null,
	messages               : [],

	//* functions - managed by zustand
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages            : (messages) => set({ messages }),
}));
 */
const useGetMessages = () => {
	const [loading, setLoading]                           = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	//! *** useEffect should be used when data fetching should be done automatocaly to update the dom when ever the page loads

	useEffect(() => {
		const getMessages = async () => {

			setLoading(true);

			try {
				const res  = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();

				if (data.error) throw new Error(data.error);

				setMessages(data);
			} 
			catch (error) {
				toast.error(error.message);
			} 
			finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages(); // only if some converstaion is selected then run this useEffect function

	}, [selectedConversation?._id, setMessages]); 
	// }, []); // wrong 

	/* //? "setMessages" is a setter still we will write it in dependcy array - making code future proof
* it's the best pratice to include the (variable-states) and  (functions) being used in the useEffect
* because -
	 * theoretically happen if the component re-renders and gets a new instance of the function), the useEffect hook should re-run to use the most recent version of setMessages
	 
! Immutable State Management:
In state management libraries like Zustand, even though the setter functions like setMessages generally do not change, adhering to the practice of including all used dependencies ensures that any possible future changes in implementation do not introduce bugs.
	 */

	return { messages, loading };
};

export default useGetMessages;
