import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser }       = useAuthContext();

	//* don't use "useEffect" because this funciton will not be automatically called (like on page refresh), but only be called when the user clicks the "login" button
	const login = async (username, password) => {

		const success = handleInputErrors(username, password);

		if (!success) return;

		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method : "POST",
				headers: { "Content-Type": "application/json" },
				body   : JSON.stringify({ username, password }),
			});

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
		finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;





function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}

/*
* Why useLogin don't use "useEffect" hook like we did in "useGetConversations.js"

In the useLogin hook you provided, useEffect is not used because the login function is intended to be triggered by user actions (like clicking a login button), rather than automatically running when the component mounts or updates.

Here's a breakdown of why useEffect isn't necessary in this context:

* 1. User-Initiated Action:
The login function is an event handler that should only be executed in response to a specific user action, such as submitting a login form. 
*This is different from data fetching that you might want to happen automatically when a component renders.

* 2. Control Over Execution:
By not placing the login function inside a useEffect, you give the component that uses this hook control over when the login process is initiated. This is important for user interactions because you typically want to wait for the user to input their credentials and submit the form.

* 3. No Side Effects on Mount:
The login process does not need to run when the component mounts; it only needs to run in response to user input. useEffect is useful when you want to automatically run some code in response to component mounts or updates, which is not the case here.

* 4. Handling Asynchronous Operations:
While useEffect is great for handling asynchronous operations that should run automatically on mount or update, asynchronous operations that are triggered by user actions (like clicking a button) do not require useEffect. Instead, they can be handled directly within the event handler functions.

*/