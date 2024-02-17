import { TextStyle } from 'react-native';

export type FontTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
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
  h5: {
    fontFamily: 'LibreFranklinRoman-ExtraBold',
    fontSize: 12,
  },
  body: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 21,
  },
  small: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 19,
  },
  tiny: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 7,
    lineHeight: 10,
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
