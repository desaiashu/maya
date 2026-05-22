import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Words from './words';
import { Theme, useTheme } from '@/ui/theme';

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options, value, onChange }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {options.map(option => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isActive && styles.activeSegment]}
          >
            <Words tag="small" alt={!isActive} button>
              {option.label}
            </Words>
          </Pressable>
        );
      })}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      overflow: 'hidden',
    },
    segment: {
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    activeSegment: {
      backgroundColor: theme.colors.button,
    },
  });

export default Toggle;
