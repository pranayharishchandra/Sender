import { useContext } from "react";
import { SocketContext } from "./SocketContext.jsx";

export const useSocketContext = () => {
	return useContext(SocketContext);
};