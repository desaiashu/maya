import { TextStyle } from 'react-native';
import { ANDROID } from '@/data';

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

const lf_bold = ANDROID ? 'LibreFranklin-Roman' : 'LibreFranklinRoman-Bold';
const lf_medium = ANDROID ? 'LibreFranklin-Roman' : 'LibreFranklinRoman-Medium';

export const fonts: Font = {
  h1: {
    fontFamily: lf_bold,
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: lf_bold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: lf_bold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  h4: {
    fontFamily: lf_bold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  h5: {
    fontFamily: lf_bold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  xl: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 24,
    lineHeight: 32,
  },
  large: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 19,
  },
  tiny: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 7,
    lineHeight: 10,
  },
  secondary: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 16,
  },
  button: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 18,
  },
  input: {
    fontFamily: lf_medium,
    fontWeight: 'normal',
    fontSize: 18,
  },
};

export const darkFonts: Font = {
  ...fonts,
  h1: {
    ...fonts.h1,
    fontFamily: lf_bold,
  },
  h2: {
    ...fonts.h2,
    fontFamily: lf_bold,
  },
  h3: {
    ...fonts.h3,
    fontFamily: lf_bold,
  },
  h4: {
    ...fonts.h4,
    fontFamily: lf_bold,
  },
  h5: {
    ...fonts.h5,
    fontFamily: lf_bold,
  },
};

///////////////////////////////
/////// Type definition ///////

export type Font = {
  [K in FontTag]: TextStyle;
};
