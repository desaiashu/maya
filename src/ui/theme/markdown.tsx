import { TextStyle, Platform } from 'react-native';
import { Font } from './font';
import { Colors } from './theme';

export type MarkdownTag =
  | 'body'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'hr'
  | 'strong'
  | 'em'
  | 's'
  | 'blockquote'
  | 'bullet_list'
  | 'ordered_list'
  | 'list_item'
  | 'bullet_list_icon'
  | 'bullet_list_content'
  | 'ordered_list_icon'
  | 'ordered_list_content'
  | 'code_inline'
  | 'code_block'
  | 'fence'
  | 'table'
  | 'thead'
  | 'tbody'
  | 'th'
  | 'tr'
  | 'td'
  | 'link'
  | 'blocklink'
  | 'image'
  | 'text'
  | 'textgroup'
  | 'paragraph'
  | 'hardbreak'
  | 'softbreak'
  | 'pre'
  | 'inline'
  | 'span';

export const markdownStyles = (fonts: Font, colors: Colors): MarkdownStyle => ({
  // The main container
  body: {
    color: colors.text.primary,
    ...fonts.body,
    marginTop: -5,
    marginBottom: -10,
    flex: 1,
  },

  // Headings
  heading1: {
    ...fonts.h1,
  },
  heading2: {
    ...fonts.h2,
  },
  heading3: {
    ...fonts.h3,
  },
  heading4: {
    ...fonts.h4,
  },
  heading5: {
    ...fonts.h5,
  },
  heading6: {
    ...fonts.h5,
  },

  // Horizontal Rule
  hr: {
    backgroundColor: colors.outline,
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },

  // Blockquotes
  blockquote: {
    backgroundColor: colors.widget,
    borderColor: colors.outline,
    borderLeftWidth: 4,
    marginLeft: 3,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  // Lists
  bullet_list: {
    marginBottom: 10,
  },
  ordered_list: {
    marginBottom: 5,
    marginTop: 10,
  },
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 40,
    // height: 5,
    lineHeight: 36,
    ...Platform.select({
      ['web']: {
        fontSize: 35,
        lineHeight: 24,
        marginLeft: 1,
        marginRight: 11,
      },
    }),
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
    marginBottom: 8,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: 0,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
    // marginTop: 2,
    marginBottom: 12,
  },

  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.widget,
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
    marginBottom: 10,
  },
  code_block: {
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.widget,
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
    marginBottom: 10,
  },
  fence: {
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.widget,
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
    marginBottom: 10,
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 3,
    marginBottom: 10,
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: 5,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: colors.outline,
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 5,
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: colors.outline,
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
    marginBottom: 10,
  },

  // Text Output
  text: {
    // ...fonts.body,
  },
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
});

///////////////////////////////
/////// Type definition ///////

export type MarkdownStyle = {
  [K in MarkdownTag]: TextStyle;
};
