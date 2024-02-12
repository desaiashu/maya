import { Font, fonts } from './font';

export const lightTheme = {
    colors: {
        background: '#FEFEFE',
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
        background: '#101',
        button: 'white',
        outline: '#777',
        header: 'black',
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