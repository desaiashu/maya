import { StateCreator } from 'zustand';
import { PerspectiveData } from '@/data/types';
import { emptyPerspective, threadid } from '@/data';

export interface PerspectiveState {
  perspectives: { [threadid: string]: PerspectiveData };
  updatePerspective: (
    messageid: number,
    chatid: string,
    data: Partial<PerspectiveData>,
  ) => void;
  updatePerspectives: (data: PerspectiveData[]) => void;
}

export const usePerspectiveState: StateCreator<PerspectiveState> = (
  set,
  get,
) => ({
  perspectives: {},
  updatePerspective: (messageid, chatid, data) =>
    set(state => {
      const existingData =
        state.perspectives[threadid(chatid, messageid)] || emptyPerspective();
      return {
        perspectives: {
          ...state.perspectives,
          [threadid(chatid, messageid)]: {
            messageid: messageid,
            chatid: chatid,
            confidence: data.confidence || existingData.confidence,
            lastupdated: data.lastupdated || existingData.lastupdated,
            related: data.related || existingData.related,
            search: data.search || existingData.search,
          },
        },
      };
    }),
  updatePerspectives: (data: PerspectiveData[]) => {
    const updated = data.reduce(
      (acc, p) => {
        acc[threadid(p.chatid, p.messageid)] = p;
        return acc;
      },
      { ...get().perspectives },
    );
    set({ perspectives: updated });
  },
});
