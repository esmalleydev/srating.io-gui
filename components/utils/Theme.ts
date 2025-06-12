
/**
 * Class to get the theme
 */
class Theme {
  public constructor(mode: string) {
    this.mode = mode;

    if (mode !== 'light' && mode !== 'dark') {
      throw new Error(`Unknown theme: ${mode}`);
    }
  }

  private mode: string;

  public getTheme() {
    if (this.mode === 'light') {
      return this.getLightTheme();
    }

    return this.getDarkTheme();
  }

  public getDarkTheme() {
    return {
      mode: 'dark',
      background: {
        main: '#121212',
      },
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
      },
      warning: {
        main: '#ffa726',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      success: {
        main: '#66bb6a',
        light: '#81c784',
        dark: '#388e3c',
      },
      error: {
        main: '#f44336',
        dark: '#d32f2f',
        light: '#e57373',
      },
      info: {
        main: '#29b6f6',
        dark: '#0288d1',
        light: '#4fc3f7',
      },
      text: {
        primary: '#fff',
        secondary: '#B3B3B3',
        disabled: '#808080',
        icon: '#808080',
      },
      link: {
        primary: '#90caf9',
      },
      grey: this.getGrey(),
    };
  }

  public getLightTheme() {
    return {
      mode: 'light',
      background: {
        main: '#efefef',
        light: '#fff',
      },
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#fff',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
      },
      text: {
        primary: '#222222',
        secondary: '#666666',
        disabled: '#9E9E9E',
      },
      link: {
        primary: '#1976d2',
      },
      grey: this.getGrey(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private getGrey() {
    return {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    };
  }
}

export default Theme;

