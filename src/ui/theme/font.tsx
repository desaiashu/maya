import { TextStyle } from 'react-native';

export type FontTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body'
  | 'xl'
  | 'large'
  | 'small'
  | 'tiny'
  | 'secondary'
  | 'button'
  | 'input';

export const fonts: Font = {
  h1: {
    fontFamily: 'LibreFranklinRoman-Bold',
    fontSize: 32,
  },
  h2: {
    fontFamily: 'LibreFranklinRoman-Bold',
    fontSize: 20,
  },
  h3: {
    fontFamily: 'LibreFranklinRoman-Bold',
    fontSize: 18,
  },
  h4: {
    fontFamily: 'LibreFranklinRoman-Bold',
    fontSize: 16,
  },
  h5: {
    fontFamily: 'LibreFranklinRoman-Bold',
    fontSize: 13,
  },
  xl: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 24,
    lineHeight: 32,
  },
  large: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
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
    fontSize: 18,
  },
  input: {
    fontFamily: 'LibreFranklinRoman-Medium',
    fontWeight: 'normal',
    fontSize: 18,
  },
};

export const darkFonts: Font = {
  ...fonts,
  h1: {
    ...fonts.h1,
    fontFamily: 'LibreFranklinRoman-Bold',
  },
  h2: {
    ...fonts.h2,
    fontFamily: 'LibreFranklinRoman-Bold',
  },
  h3: {
    ...fonts.h3,
    fontFamily: 'LibreFranklinRoman-Bold',
  },
  h4: {
    ...fonts.h4,
    fontFamily: 'LibreFranklinRoman-Bold',
  },
  h5: {
    ...fonts.h5,
    fontFamily: 'LibreFranklinRoman-Bold',
  },
};

///////////////////////////////
/////// Type definition ///////

export type Font = {
  [K in FontTag]: TextStyle;
};
