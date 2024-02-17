import React, { useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import { Message } from '@/data/types';
import { MessageUI } from '@/views/chat/components';
import { StreamState, getStream } from '@/data';
import { defaultAvatar } from '@/data';

interface Props {
  prev: Message;
  avatars: { [key: string]: string };
  usernames: { [key: string]: string };
}

export const Stream: React.FC<Props> = props => {
  const { prev, avatars, usernames } = props;

  const chunks = getStream((state: StreamState) => state.chunks);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.create(10, 'easeInEaseOut', 'opacity'),
    // );
  }, [chunks]);

  if (chunks.chatid !== prev.chatid) {
    console.log('null');
    return null;
  }
  console.log('rendering');
  return (
    <MessageUI
      current={chunks}
      next={undefined}
      prev={prev}
      avatar={avatars[chunks.sender] || defaultAvatar}
      username={usernames[chunks.sender] || ''}
      position={'left'}
    />
  );
};

export default Stream;
