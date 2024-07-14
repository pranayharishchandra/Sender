import { useEffect }      from "react";
import useConversation    from "../../zustand/useConversation";
import MessageInput	 	    from "./MessageInput";
import Messages 			    from "./Messages";
import { TiMessages }     from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		//! lama dev: https://youtu.be/QQYeipc_cik?t=750
		// cleanup function (unmounts) - when we re-login then the initial state must be cleared, so for clearing that inital state we will use clean up funciton
		//* And when I click, it runs the clean-up function  first, and only after that it runs the effect  
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		// <div className='md:min-w-[450px] flex flex-col'>
		<div className='md:min-w-[600px] flex flex-col'>

			{/* if no conversation selected then diplay hello welcome, when they click the conversaion then dispaly the conversation, by updating the state in the hook */}
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-purple-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome {authUser.fullName}</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

/*

* ********** How the Cleanup Function Works **********

* 1. Initialization: 
When the component mounts, the effect function runs after the render is committed to the screen. 
In your case, there's no code in the effect function itself, so nothing happens initially.

* 2. Dependency Change: 
 If the dependency (setSelectedConversation) changes, React first runs the cleanup function from the previous effect before running the effect function again. This ensures that any side effects from the previous render are cleaned up before setting up new ones.

* 3. Component Unmount: 
 When the component is about to unmount from the DOM, React runs the cleanup function to clean up any side effects that should not persist after the component has been removed. In your example, this cleanup involves setting the selectedConversation to null, which might be used to reset the state when the user logs out or switches to a different part of the application.


* ********** Purpose of Cleanup **********

*Prevent Memory Leaks:
 Cleanup functions are crucial for preventing memory leaks, especially in effects that set up subscriptions, timers, or manually manipulate the DOM.

*Reset State: 
As in your example, it can be used to reset the state to ensure that stale or irrelevant data does not persist when the state or components should be reinitialized.

*Remove Event Listeners:
 If you set up event listeners in an effect, you should remove them in the cleanup function to prevent multiple instances of the same listener. 
 
 */












// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
