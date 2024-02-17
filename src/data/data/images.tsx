interface RequireConverter {
  [key: string]: {
    light: any;
    dark: any;
  };
}

export const humanAvatars: RequireConverter = {
  'local://user.png': {
    light: require('%/avatars/light/user.png'),
    dark: require('%/avatars/dark/user.png'),
  },
  'local://1333166.png': {
    light: require('%/avatars/light/1333166.png'),
    dark: require('%/avatars/dark/1333166.png'),
  },
  'local://1333167.png': {
    light: require('%/avatars/light/1333167.png'),
    dark: require('%/avatars/dark/1333167.png'),
  },
  'local://1473489.png': {
    light: require('%/avatars/light/1473489.png'),
    dark: require('%/avatars/dark/1473489.png'),
  },
  'local://1473510.png': {
    light: require('%/avatars/light/1473510.png'),
    dark: require('%/avatars/dark/1473510.png'),
  },
  'local://1805319.png': {
    light: require('%/avatars/light/1805319.png'),
    dark: require('%/avatars/dark/1805319.png'),
  },
  'local://2199210.png': {
    light: require('%/avatars/light/2199210.png'),
    dark: require('%/avatars/dark/2199210.png'),
  },
  'local://2361448.png': {
    light: require('%/avatars/light/2361448.png'),
    dark: require('%/avatars/dark/2361448.png'),
  },
  'local://2457127.png': {
    light: require('%/avatars/light/2457127.png'),
    dark: require('%/avatars/dark/2457127.png'),
  },
  'local://3478983.png': {
    light: require('%/avatars/light/3478983.png'),
    dark: require('%/avatars/dark/3478983.png'),
  },
  'local://3758074.png': {
    light: require('%/avatars/light/3758074.png'),
    dark: require('%/avatars/dark/3758074.png'),
  },
  'local://3758075.png': {
    light: require('%/avatars/light/3758075.png'),
    dark: require('%/avatars/dark/3758075.png'),
  },
  'local://3921560.png': {
    light: require('%/avatars/light/3921560.png'),
    dark: require('%/avatars/dark/3921560.png'),
  },
  'local://3921571.png': {
    light: require('%/avatars/light/3921571.png'),
    dark: require('%/avatars/dark/3921571.png'),
  },
  'local://4685615.png': {
    light: require('%/avatars/light/4685615.png'),
    dark: require('%/avatars/dark/4685615.png'),
  },
  'local://6566386.png': {
    light: require('%/avatars/light/6566386.png'),
    dark: require('%/avatars/dark/6566386.png'),
  },
};

export const botAvatars: RequireConverter = {
  'local://einstein.png': {
    light: require('%/avatars/light/einstein.png'),
    dark: require('%/avatars/dark/einstein.png'),
  },
  'local://openai.png': {
    light: require('%/avatars/light/openai.png'),
    dark: require('%/avatars/dark/openai.png'),
  },
  'local://oracle.png': {
    light: require('%/avatars/light/oracle.png'),
    dark: require('%/avatars/dark/oracle.png'),
  },
};

export const icons: RequireConverter = {
  compose: {
    light: require('%/icons/light/compose.png'),
    dark: require('%/icons/dark/compose.png'),
  },
  profile: {
    light: require('%/icons/light/profile.png'),
    dark: require('%/icons/dark/profile.png'),
  },
  close: {
    light: require('%/icons/light/close.png'),
    dark: require('%/icons/dark/close.png'),
  },
  settings: {
    light: require('%/icons/light/settings.png'),
    dark: require('%/icons/dark/settings.png'),
  },
};
