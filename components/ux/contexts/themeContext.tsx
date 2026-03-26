'use client';

import React, { createContext, useContext, ReactNode } from 'react';

import { Theme } from '@esmalley/ts-utils';


export type Themes = 'dark' | 'light';

// Create the context
const ThemeContext = createContext<Themes>('dark');

// Create a provider component
interface ThemeProviderProps {
  theme: Themes;
  children: ReactNode;
}


const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for using the context
const useTheme = () => {
  const mode = useContext(ThemeContext);
  if (!mode) {
    throw new Error('useTheme must be used within a ThemeProivder');
  }

  const theme = new Theme(mode).getTheme();
  return theme;
};


export { ThemeProvider, useTheme };
