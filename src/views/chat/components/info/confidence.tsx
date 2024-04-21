import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Words } from '@/ui/atoms';
import { Confidence } from '@/data/types';
import { Theme, useTheme, FontTag } from '@/ui/theme';

interface ConfidenceProps {
  confidence?: Confidence;
  onPress?: () => void;
  tag?: FontTag;
  size?: number;
  style?: ViewStyle;
}

const ConfidenceBadge: React.FC<ConfidenceProps> = props => {
  const { confidence, onPress, style, tag = 'small', size = 11 } = props;
  const theme = useTheme();
  const styles = getStyles(theme, size);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={[styles.circle, style]}>
        <Words tag={tag} style={styles.number}>
          {confidence ? confidence.value : '85'}
        </Words>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, size: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row', // This makes child components align horizontally
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginBottom: 0,
      paddingBottom: 0,
    },
    button: {
      // Add any additional button styles if needed
    },
    circle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 30, // Adjust size as needed
      height: 30, // Adjust size as needed
      paddingLeft: 1,
      paddingTop: 1,
      left: 6.5,
      bottom: 10,
      borderRadius: 15, // Half of width/height to make it a circle
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    number: { fontSize: size },
    high: {},
    mid: {},
    low: {},
  });

export default ConfidenceBadge;
