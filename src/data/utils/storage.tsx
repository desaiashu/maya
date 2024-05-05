import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';
import { RESET_STATE, WEB } from '@/data/utils/config';

let storage = new MMKV({ id: 'state' });

if (RESET_STATE) WEB ? localStorage.clear() : storage.clearAll();

export const zustandStorage: StateStorage = WEB
  ? localStorage
  : {
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
