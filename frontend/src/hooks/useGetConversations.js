// TODO: when new user is added then it's adding it in the conversations in 30 seconds or have to do hard refresh, SOLUTION: when new user created, send that to frontend using "Socket.io" for real-time
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {

	const [loading, setLoading]             = useState(false);
	const [conversations, setConversations] = useState([]);



  const fetchConversations = async () => {
    setLoading(true);

    try {
      const res  = await fetch("/api/users");
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


  useEffect(() => {
    fetchConversations();

    // Set up polling to fetch conversations every 30 seconds
    const intervalId = setInterval(fetchConversations, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
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