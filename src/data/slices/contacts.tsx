import { StateCreator } from 'zustand';
import { Profile } from '@/data/types';

export interface ContactsState {
  humans: Profile[];
  bots: Profile[];
  addContact: (contact: Profile) => void;
  addContacts: (contacts: Profile[]) => void;
  removeContact: (userId: string) => void;
  updateContact: (updatedContact: Profile) => void;
  updateBots: (bots: Profile[]) => void;
  userFromId: (userId: string) => Profile | undefined;
}

export const useContactsState: StateCreator<ContactsState> = (set, get) => ({
  humans: [],
  bots: [],
  addContact: (contact: Profile) =>
    set(state => ({ humans: [...state.humans, contact] })),
  addContacts: (contacts: Profile[]) =>
    set(state => ({ humans: [...state.humans, ...contacts] })),
  removeContact: (userId: string) =>
    set(state => ({
      humans: state.humans.filter(user => user.userid !== userId),
    })),
  updateContact: (updatedContact: Profile) =>
    set(state => ({
      humans: state.humans.map(user =>
        user.userid === updatedContact.userid ? updatedContact : user,
      ),
    })),
  updateBots: (bots: Profile[]) => set({ bots }),
  userFromId: (userId: string) => {
    const state = get();
    return state.humans.find((user: Profile) => user.userid === userId);
  },
});
