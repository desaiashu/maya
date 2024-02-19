import React, { useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import { Message } from '@/data/types';
import { MessageUI } from '@/views/chat/components';
import { StreamState, useStream } from '@/data';

interface Props {
  prev?: Message;
  avatars: Record<string, string>;
  usernames: Record<string, string>;
}

export const Stream: React.FC<Props> = props => {
  const { prev, avatars, usernames } = props;

  const chunks = useStream((state: StreamState) => state.chunks);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //Intentionally slow down the rendering to be legible
    const start = Date.now();
    while (Date.now() - start < 50) {}
  }, [chunks]);

  if (prev && chunks.chatid !== prev.chatid) {
    return null;
  }
  return (
    <MessageUI
      current={chunks}
      next={undefined}
      prev={prev}
      avatar={avatars[chunks.sender]}
      username={usernames[chunks.sender] || ''}
      position={'left'}
    />
  );
};

export default Stream;
