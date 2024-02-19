import { Font, fonts, darkFonts } from './font';

export const lightTheme = {
  colors: {
    background: '#f2f2f2',
    transparent: 'rgba(0, 0, 0, 0)',
    button: 'black',
    outline: '#999',
    header: '#e8e8e9',
    text: {
      primary: '#121212',
      secondary: 'grey',
      contrast: '#f2f2f2',
    },
  },
  iconOpacity: 0.85,
  fonts,
};

export const darkTheme = {
  colors: {
    background: '#121212',
    transparent: 'rgba(0, 0, 0, 0)',
    button: '#ccc',
    outline: '#777',
    header: '#222',
    text: {
      primary: '#ccc',
      secondary: 'grey',
      contrast: '#121212',
    },
  },
  iconOpacity: 0.7,
  fonts: darkFonts,
};

///////////////////////////////
/////// Type definition ///////

export type Theme = {
  colors: {
    background: string;
    transparent: string;
    button: string;
    outline: string;
    header: string;
    text: {
      primary: string;
      secondary: string;
      contrast: string;
    };
  };
  iconOpacity: number;
  fonts: Font;
};
