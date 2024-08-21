import { Font, fonts, darkFonts } from './font';
import { MarkdownStyle, markdownStyles } from './markdown';

const lightColors = {
  background: '#f2f2f2',
  widget: '#f2f2f2',
  transparent: 'rgba(0, 0, 0, 0)',
  button: 'black',
  outline: '#999',
  header: '#e8e8e9',
  text: {
    primary: '#121212',
    secondary: 'grey',
    contrast: '#f2f2f2',
  },
};

const darkColors = {
  background: '#121212',
  widget: '#121212',
  transparent: 'rgba(0, 0, 0, 0)',
  button: '#ccc',
  outline: '#777',
  header: '#222',
  text: {
    primary: '#ccc',
    secondary: 'grey',
    contrast: '#121212',
  },
};

export const lightTheme = {
  colors: lightColors,
  iconOpacity: 0.85,
  fonts,
  markdownStyles: markdownStyles(fonts, lightColors),
};

export const darkTheme = {
  colors: darkColors,
  iconOpacity: 0.7,
  fonts: darkFonts,
  markdownStyles: markdownStyles(darkFonts, darkColors),
};

///////////////////////////////
/////// Type definition ///////

export type Colors = {
  background: string;
  widget: string;
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

export type Theme = {
  colors: Colors;
  iconOpacity: number;
  fonts: Font;
  markdown: MarkdownStyle;
};
