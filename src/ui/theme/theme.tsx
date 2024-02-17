import { Font, fonts } from './font';

export const lightTheme = {
  colors: {
    background: '#f2f2f2',
    transparent: 'rgba(0, 0, 0, 0)',
    button: 'black',
    outline: '#999',
    header: '#f9f9f9',
    text: {
      primary: 'black',
      secondary: 'grey',
      contrast: 'white',
    },
  },
  fonts,
};

export const darkTheme = {
  colors: {
    background: '#121212',
    transparent: 'rgba(0, 0, 0, 0)',
    button: 'white',
    outline: '#777',
    header: '#222',
    text: {
      primary: 'white',
      secondary: 'grey',
      contrast: 'black',
    },
  },
  fonts,
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
  fonts: Font;
};
