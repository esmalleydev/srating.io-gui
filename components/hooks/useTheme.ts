'use client';

import { useAppSelector } from '@/redux/hooks';
import { Theme } from '@esmalley/ts-utils';


export const useTheme = () => {
  const mode = useAppSelector((state) => state.themeReducer.mode);

  const theme = new Theme(mode).getTheme();

  return theme;
};
