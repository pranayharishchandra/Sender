import { useAuthContext } from "../../context/AuthContext";
import { extractTime }    from "../../utils/extractTime";
import useConversation    from "../../zustand/useConversation";

const Message = ({ message }) => {

	const { authUser }             = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe                   = message.senderId === authUser._id;
	const formattedTime            = extractTime(message.createdAt);
	const chatClassName            = fromMe ? "chat-end" : "chat-start";
	const profilePic               = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor            = fromMe ? "bg-purple-500" : "bg-black"; // messages sent by me are in "blue" and msg i have recieved are black or ""

	const shakeClass = message.shouldShake ? "shake" : "";

	//* "shakeClass" -> shake animation logic written in "index.css"
	//* and "chatClassName" -> "chat-end" or "chat-start" by DaisyUI
	return (
		// <div className={`chat shake ${chatClassName}`}>
		<div className={`chat ${chatClassName}`}>

			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>

			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
			
		</div>
	);
};

export default Message;
