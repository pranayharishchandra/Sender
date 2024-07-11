import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

//* this function is used by main.js to wrap
export const AuthContextProvider = ({ children }) => {
	//* after SignUp or LoginIn, the userinformation was set in cookie for backend and 
	//* local storage for the frontend
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>	 {children}	 </AuthContext.Provider>;
};

/*
* when you create a context, you also create a provider function
! create context: "AuthContext"
! proverder fn  : "AuthContextProvider" // main.js

! App.jsx using AuthContext, using the custom hook created "useAuthContext"
import { useAuthContext } from "./context/AuthContext";
function App() {
	const { authUser } = useAuthContext();
	...
}
*/