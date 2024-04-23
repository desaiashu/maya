import { StateCreator } from 'zustand';
import { PerspectiveData } from '@/data/types';
import { emptyPerspective } from '@/data';

export interface PerspectiveState {
  perspectives: { [messageid: string]: PerspectiveData };
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
      const existingData = state.perspectives[messageid] || emptyPerspective();
      return {
        perspectives: {
          ...state.perspectives,
          [messageid]: {
            messageid: messageid,
            chatid: chatid,
            confidence: data.confidence,
            relatedTopics: data.relatedTopics || existingData.relatedTopics,
            searchResults: data.searchResults || existingData.searchResults,
          },
        },
      };
    }),
});
