import { TextStyle } from 'react-native';

export type FontTag = 
'h1' | 
'h2' | 
'h3' | 
'body' | 
'secondary' | 
'button' | 
'input';

export const fonts: Font = {
    h1: {
        fontFamily: 'roboto',
        fontWeight: 'bold',
        fontSize: 32,
    },
    h2: {
        fontFamily: 'roboto',
        fontWeight: 'bold',
        fontSize: 24,
    },
    h3: {
        fontFamily: 'roboto',
        fontWeight: 'bold',
        fontSize: 20,
    },
    body: {
        fontFamily: 'roboto',
        fontWeight: 'normal',
        fontSize: 16,
    },
    secondary: {
        fontFamily: 'roboto',
        fontWeight: 'normal',
        fontSize: 16,
    },
    button: {
        fontFamily: 'roboto',
        fontWeight: 'normal',
        fontSize: 16,
    },
    input: {
        fontFamily: 'roboto',
        fontWeight: 'normal',
        fontSize: 16,
    },
};

///////////////////////////////
/////// Type definition ///////

export type Font = {
    [K in FontTag]: TextStyle;
};