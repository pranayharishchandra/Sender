import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji }  from "../../utils/emojis";
import Conversation        from "./Conversation";


const Conversations = () => {

	//! conversations = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
	const { loading, conversations } = useGetConversations(); //* all the conversations (users other than current user)

	console.log(conversations) //! it's not working, this should component should re-render as "conversations" changes by "SearchInput.jsx", in "SearchInput.jsx" and "useGetConversations" is re-rendering as "search" variable changed

	return (
		<div className='py-2 flex flex-col overflow-auto md:min-w-[15vw]'>

			{conversations.map( (conversation, idx) => (
				<Conversation
					key          = {conversation._id} //* conversation._id: basically referecne to that converstion, (as using it you can access whole conversation)
					conversation = {conversation}
					emoji        = {getRandomEmoji()}
					lastIdx      = {idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
