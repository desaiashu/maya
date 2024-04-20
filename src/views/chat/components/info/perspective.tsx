import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Words, Button } from '@/ui/atoms';
import { Message } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { Confidence } from '@/views/chat/components';

interface PerspectiveProps {
  message: Message;
  onPress: () => void;
}

const Perspective: React.FC<PerspectiveProps> = props => {
  const { message, onPress } = props;
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Button
        tag="small"
        outlined
        shadow
        title="points of view "
        onPress={onPress}
        style={styles.button}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row', // This makes child components align horizontally
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginBottom: 0,
      paddingBottom: 0,
    },
    button: {
      paddingTop: 4,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 3,
    },
  });

export default Perspective;
