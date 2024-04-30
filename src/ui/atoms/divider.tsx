import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/ui/theme';

interface DividerProps {
  color?: string;
  thickness?: number;
  marginTop?: number;
  marginBottom?: number;
}

const Divider: React.FC<DividerProps> = props => {
  const theme = useTheme();
  const {
    color = theme.colors.outline,
    thickness = 0.2,
    marginTop = 3,
    marginBottom = 0,
  } = props;
  const styles = getStyles({ color, thickness, marginTop, marginBottom });

  return <View style={styles.divider} />;
};

const getStyles = ({
  color,
  thickness,
  marginTop,
  marginBottom,
}: DividerProps) =>
  StyleSheet.create({
    divider: {
      height: thickness,
      justifyContent: 'center',
      width: '80%',
      marginLeft: '10%',
      backgroundColor: color,
      opacity: 0.3,
      marginTop: marginTop,
      marginBottom: marginBottom,
    },
  });

export default Divider;
