import { StateCreator } from 'zustand';
import {
  Confidence,
  PerspectiveData,
  RelatedTopic,
  SearchResult,
} from '@/data/types';
import { threadid } from '@/data';

export interface PerspectiveState {
  perspectives: Record<string, PerspectiveData>;
  confidences: Record<string, Confidence>;
  results: Record<string, SearchResult[]>;
  topics: Record<string, RelatedTopic[]>;
  saveConfidence: (data: Confidence) => void;
  saveTopics: (data: RelatedTopic[]) => void;
  saveResults: (data: SearchResult[]) => void;
  // updatePerspective: (
  //   messageid: number,
  //   chatid: string,
  //   data: Partial<PerspectiveData>,
  // ) => void;
  updatePerspectives: (data: PerspectiveData[]) => Partial<PerspectiveState>;
}

export const usePerspectiveState: StateCreator<PerspectiveState> = (
  set,
  get,
) => ({
  perspectives: {},
  confidences: {},
  results: {},
  topics: {},

  saveConfidence: data =>
    set(state => ({
      confidences: {
        ...state.confidences,
        [threadid(data.chatid, data.messageid)]: data,
      },
    })),

  saveTopics: data =>
    set(state => ({
      topics: {
        ...state.topics,
        [threadid(data[0].chatid, data[0].messageid)]: data,
      },
    })),

  saveResults: data =>
    set(state => ({
      results: {
        ...state.results,
        [threadid(data[0].chatid, data[0].messageid)]: data,
      },
    })),

  // updatePerspective: (messageid, chatid, data) =>
  //   set(state => {
  //     const id = threadid(chatid, messageid);
  //     const existingData = state.perspectives[id] || emptyPerspective();
  //     const newPerspective = {
  //       ...existingData,
  //       ...data,
  //       messageid,
  //       chatid,
  //     };
  //     return {
  //       perspectives: {
  //         ...state.perspectives,
  //         [id]: newPerspective,
  //       },
  //     };
  //   }),
  updatePerspectives: (data: PerspectiveData[]) => {
    const state = get();
    const perspectives = { ...state.perspectives };
    const confidences = { ...state.confidences };
    const results = { ...state.results };
    const topics = { ...state.topics };
    for (const p of data) {
      const id = threadid(p.chatid, p.messageid);
      const perspective = {
        chatid: p.chatid,
        messageid: p.messageid,
        lastupdated: p.lastupdated,
        related: [],
        search: [],
      };
      perspectives[id] = { ...perspectives[id], ...perspective };
      confidences[id] = { ...confidences[id], ...p.confidence };
      results[id] = p.search || results[id] || [];
      topics[id] = p.related || topics[id] || [];
    }
    return { perspectives, confidences, results, topics };
  },
});
