import React, { useEffect } from 'react';
import { Message } from '@/data/types';
import { MessageUI } from '@/views/chat/components';
import { StreamState, useStream, prepAnimation } from '@/data';

interface Props {
  prev?: Message;
  avatars: Record<string, string>;
  usernames: Record<string, string>;
  chatid: string;
}

export const Stream: React.FC<Props> = props => {
  const { prev, avatars, usernames, chatid } = props;

  const chunks = useStream((state: StreamState) => state.chunks);

  useEffect(() => {
    prepAnimation('ease');
  }, [chunks]);

  if (chunks.chatid !== chatid) return null;

  return (
    <MessageUI
      current={chunks}
      next={undefined}
      prev={prev}
      avatar={avatars[chunks.sender]}
      username={usernames[chunks.sender] || ''}
      stream={true}
    />
  );
};

export default Stream;
