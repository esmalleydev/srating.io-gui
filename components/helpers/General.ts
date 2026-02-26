
import { getStore } from '@/app/StoreProvider';
import { Theme } from '@esmalley/ts-utils';


class General {
  public static getBestColor(): string {
    const store = getStore();

    const { mode } = store.getState().themeReducer;

    const theme = new Theme(mode).getTheme();

    return mode === 'light' ? theme.success.main : theme.success.dark;
  }

  public static getWorstColor(): string {
    const store = getStore();

    const { mode } = store.getState().themeReducer;

    const theme = new Theme(mode).getTheme();

    return mode === 'light' ? theme.error.main : theme.error.dark;
  }

  public static getLogoColorPrimary(): string {
    const store = getStore();

    const { mode } = store.getState().themeReducer;

    const theme = new Theme(mode).getTheme();

    return mode === 'light' ? theme.warning.light : '#FDD835';
  }

  public static getLogoColorSecondary(): string {
    const store = getStore();

    const { mode } = store.getState().themeReducer;

    // const theme = new Theme(mode).getTheme();

    return mode === 'light' ? '#482ab9' : '#2ab92a';
  }
}

export default General;
