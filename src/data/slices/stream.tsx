// import { create } from 'zustand';

// // Define the shape of your store
// interface Store {
//   message: string;
//   chatid: number;
//   activeChat: number;
//   timestamp: number;
//   streaming: boolean;
//   updateChunk: (chunk: string) => void;
//   // ... other methods ...
// }

// // Set active chat when chat view is opened (useEffect)
// // Unset when it's closed (back button)

// // If chunkupdate, check if active chat is the same as the chatid in the chunk
// // If timestamp matches, continue streaming
// // If streaming is false, start streaming

// // Create a new store
// export const useStream = create<Store>((set, get) => ({
//   message: '',
//   chatid: 0,
//   activeChat: 0,
//   timestamp: 0,
//   streaming: false,
//   updateChunk: (chunk: string) => {
//     set(state => ({}));
//   },
//   resetChunks: () => {
//     set({
//       message: '',
//       chatid: 0,
//       activeChat: 0,
//       timestamp: 0,
//       streaming: false,
//     });
//   },
// }));
