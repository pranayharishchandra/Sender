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

		if (selectedConversation?._id) getMessages();

	}, [selectedConversation?._id, setMessages]);
	// }, []); // wrong 

	return { messages, loading };
};

export default useGetMessages;
