import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';
import { RESET_STATE } from '@/data/utils/config';

export const storage = new MMKV({ id: 'state' });

if (RESET_STATE) {
  storage.clearAll();
}

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};
