import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Words } from '@/ui/atoms';
import { RelatedTopic } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';

interface RelatedProps {
  related: RelatedTopic[];
  onSelect: (topic: string) => void;
}

const Related: React.FC<RelatedProps> = props => {
  const { related, onSelect } = props;
  const styles = getStyles(useTheme());

  return (
    <View style={styles.container}>
      {related.map((r, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, styles.shadow]}
          onPress={() => onSelect(r.topic)}
        >
          <Words tag={'small'} style={styles.title}>
            {r.topic + '  ⇢'}
          </Words>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column', // This makes child components align horizontally
      // alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: 0,
      paddingBottom: 0,
    },
    button: {
      backgroundColor: theme.colors.background,
      borderRadius: 3,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 5,
      marginRight: 4,
      width: '94%',
    },
    shadow: {
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
      elevation: 5,
    },
    title: {
      //   height: 30,
      fontSize: 11,
      //   marginBottom: 10,
    },
    url: {
      height: 10,
    },
  });

export default Related;
