import { create } from "zustand";

const useConversation = create((set) => ({
	//* states - managed by zustand
	selectedConversation   : null,
	messages               : [],

	//* function - by zustand
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages            : (messages) 					  => set({ messages }),
}));

export default useConversation;

/*
* Zustand
Zustand is a small, fast, and scalable state management solution for React applications. It is designed to be easy to use and lightweight compared to other state management libraries like Redux. Here are some reasons why developers choose to use Zustand:

* Why Use Zustand?
*Simplicity:
Easy to Understand: Zustand has a straightforward API, making it easy to learn and use.
* Minimal Boilerplate: 
Unlike Redux, Zustand requires very little setup and boilerplate code. You can define your state and actions in a single place.

* ************* set *************
set is a function provided by the library to update the state of the store. It is similar to how you would use setState in React's useState hook, but it's used to update the state within the Zustand store.

*Key Features of Zustand
- Global     State Management    : Manage global state easily without prop drilling.
- React      DevTools Integration: Zustand integrates with React DevTools for easier debugging.
- Middleware Support             : Optional middleware support for logging, persistence, etc.
- SSR        Support             : Zustand works with server-side rendering out of the box.
- TypeScript Support             : Full TypeScript support for better developer experience. 

*/
/**
** example program
//! store.js
import create from 'zustand';

const useStore = create((set) => ({
  count: 0, //* state
  increment: () => set( (state) => ({ count: state.count + 1 }) ), //* funciton
  decrement: () => set( (state) => ({ count: state.count - 1 }) ),
}));

export default useStore;

*/

/**
** The reason for the function inside the set function is to access the current state and update it based on the existing state. 
In your first example with count, the increment and decrement functions need to know the current value of count to correctly calculate the new value. Here's a detailed explanation:

** State Update Based on Previous State
** When you want to update a state property based on its current value, you need to use a function inside set. This function receives the current state, allowing you to compute the new state.

** Example with count

const useStore = create((set) => ({
  count: 0, //* state
  increment: () => set((state) => ({ count: state.count + 1 })), //* function
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

Here, increment and decrement functions receive the current state as an argument and return a new state object. This ensures that the new count is based on the current count value.

Direct State Update
When you don't need the current state to compute the new state, you can directly pass the new state to set.

** Example with selectedConversation and messages
** In this example, setSelectedConversation and setMessages don't depend on the current state to set the new state. They just set the provided values directly.


const useConversation = create((set) => ({
  //* states - managed by zustand
  selectedConversation: null,
  messages: [],

  //* function - by zustand
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  setMessages: (messages) => set({ messages }),
}));

 */