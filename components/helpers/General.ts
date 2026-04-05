
import { getStore } from '@/app/StoreProvider';
import { Theme } from '@esmalley/ts-utils';
import { MultiPickerOption } from '../ux/input/MultiPicker';


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

  public static getTerminologyOptions = (type: string) => {
    const store = getStore();

    const terminologies = store.getState().dictionaryReducer.terminology || {};

    const options: MultiPickerOption[] = [];

    for (const terminology_id in terminologies) {
      const row = terminologies[terminology_id];

      if (row.inactive) {
        continue;
      }

      if (row.type === type) {
        options.push({
          label: row.name,
          value: row.terminology_id,
        });
      }
    }

    return options;
  };
}

export default General;
