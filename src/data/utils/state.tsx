import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/data/utils/storage';
import {
  UserState,
  useUserState,
  ContactsState,
  useContactsState,
  ChatlistState,
  useChatlistState,
  MessagesState,
  useMessagesState,
  PerspectiveState,
  usePerspectiveState,
  CodeState,
  useCodeState,
} from '@/data/slices';

export type State = UserState &
  ContactsState &
  ChatlistState &
  MessagesState &
  PerspectiveState &
  CodeState;

export const useStore = create<State>()(
  persist(
    (...a) => ({
      ...useUserState(...a),
      ...useContactsState(...a),
      ...useChatlistState(...a),
      ...useMessagesState(...a),
      ...usePerspectiveState(...a),
      ...useCodeState(...a),
    }),
    {
      name: 'state',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
