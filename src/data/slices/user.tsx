import { StateCreator } from 'zustand';
import { User, Profile } from '@/data/types';

export interface UserState {
  currentUser: User;
  isAuthenticated: boolean;
  token: string;
  setPhone: (userid: string) => void;
  updateToken: (token: string) => void;
  authenticate: () => void;
  setUser: (user: User) => void;
  setUserProfile: (profile: Profile) => void;
  clearUser: () => void;
  updateContacts: (contacts: string[]) => void;
}

const emptyUser: User = {
  userid: '',
  username: '',
  avatar: '',
  contacts: [],
  bot: false,
};

export const useUserState: StateCreator<UserState> = set => ({
  currentUser: emptyUser,
  isAuthenticated: false,
  token: '',
  setPhone: (userid: string) =>
    set(state => ({ currentUser: { ...state.currentUser, userid } })),
  updateToken: (token: string) => set({ token }),
  authenticate: () => set({ isAuthenticated: true }),
  setUser: (user: User) => set({ currentUser: user }),
  setUserProfile: (profile: Profile) =>
    set(state => ({
      currentUser: {
        ...state.currentUser,
        userid: profile.userid,
        username: profile.username,
        avatar: profile.avatar,
      },
    })),
  clearUser: () => set({ currentUser: emptyUser, isAuthenticated: false }),
  updateContacts: (contacts: string[]) =>
    set(state => ({ currentUser: { ...state.currentUser, contacts } })),
});
