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
}

export const usePerspectiveState: StateCreator<PerspectiveState> = set => ({
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
            relatedTopics: data.relatedTopics || existingData.relatedTopics,
            searchResults: data.searchResults || existingData.searchResults,
          },
        },
      };
    }),
});
