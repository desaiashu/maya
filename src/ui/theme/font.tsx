import { TextStyle } from 'react-native';

export type FontTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'small'
  | 'tiny'
  | 'secondary'
  | 'button'
  | 'input';

export const fonts: Font = {
  h1: {
    fontFamily: 'LibreFranklinRoman-ExtraBold',
    fontSize: 32,
  },
  h2: {
    fontFamily: 'LibreFranklinRoman-ExtraBold',
    fontSize: 24,
  },
  h3: {
    fontFamily: 'LibreFranklinRoman-ExtraBold',
    fontSize: 18,
  },
  h4: {
    fontFamily: 'LibreFranklinRoman-ExtraBold',
    fontSize: 14,
  },
  body: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 14,
  },
  small: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 13,
  },
  tiny: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 10,
  },
  secondary: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 16,
  },
  button: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 16,
  },
  input: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 16,
  },
};

///////////////////////////////
/////// Type definition ///////

export type Font = {
  [K in FontTag]: TextStyle;
};
