'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../redux/store';

let globalStore: AppStore;

export function getStore(): AppStore {
  if (!globalStore) {
    throw new Error('Store not initialized');
  }

  return globalStore;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    globalStore = storeRef.current;
  }

  // so I can debug garbage redux + react
  if (typeof window !== 'undefined') {
    window.globalStore = globalStore;
  }

  return (
    <Provider store={storeRef.current}>{children}</Provider>
  );
}
