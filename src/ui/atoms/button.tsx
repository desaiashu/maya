import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Words } from '@/ui/atoms';
import { Theme, useTheme } from '@/ui/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
  }

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <TouchableOpacity style={styles.button} onPress={onPress} >
            <Words tag='button'>{title}</Words>
        </TouchableOpacity>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    button: {
        backgroundColor: theme.colors.button, // Set the background color
        paddingTop: 14, // Add padding
        paddingBottom: 14, // Add padding
        paddingLeft: 20, // Add padding
        paddingRight: 20, // Add padding
        borderRadius: 5, // Add rounded corners
        margin: 10
    },
  });

export default Button;