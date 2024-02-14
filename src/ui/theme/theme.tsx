import { Font, fonts } from './font';

export const lightTheme = {
    colors: {
        background: '#f2f2f2',
        button: 'black',
        outline: '#999',
        header: 'white',
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