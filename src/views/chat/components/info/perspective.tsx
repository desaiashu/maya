import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/ui/atoms';

interface PerspectiveProps {
  onPress: () => void;
}

const Perspective: React.FC<PerspectiveProps> = props => {
  const { onPress } = props;
  const styles = getStyles();
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

const getStyles = () =>
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
