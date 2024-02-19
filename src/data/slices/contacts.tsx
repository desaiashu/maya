import { StateCreator } from 'zustand';
import { Profile } from '@/data/types';

export interface ContactsState {
  humans: Profile[];
  bots: Profile[];
  updateHumans: (contacts: Profile[]) => void;
  updateBots: (bots: Profile[]) => void;
  userFromId: (userId: string) => Profile | undefined;
}

export const useContactsState: StateCreator<ContactsState> = (set, get) => ({
  humans: [],
  bots: [],

  updateBots: (bots: Profile[]) => set({ bots }),

  updateHumans: (updated: Profile[]) => {
    set(state => ({
      humans: updated.reduce(
        (acc, c) => {
          const index = acc.findIndex(contact => contact.userid === c.userid);
          index > -1 && acc.splice(index, 1);
          acc.push(c);
          return acc;
        },
        [...state.humans],
      ),
    }));
  },

  userFromId: (userId: string) =>
    get().humans.find((user: Profile) => user.userid === userId),
});
