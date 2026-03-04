'use client';

import { useAppSelector } from '@/redux/hooks';
import { Theme } from '@esmalley/ts-utils';
import { useMemo } from 'react';


export const useTheme = () => {
  const mode = useAppSelector((state) => state.themeReducer.mode);

  return useMemo(() => {
    return new Theme(mode).getTheme();
  }, [mode]);
};
