import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserState,
  useUserState,
  ContactsState,
  useContactsState,
  ChatlistState,
  useChatlistState,
  MessagesState,
  useMessagesState,
} from '@/data/slices';

export type State = UserState & ContactsState & ChatlistState & MessagesState;

export const getState = create<State>()(
  persist(
    (...a) => ({
      ...useUserState(...a),
      ...useContactsState(...a),
      ...useChatlistState(...a),
      ...useMessagesState(...a),
    }),
    {
      name: 'state',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
