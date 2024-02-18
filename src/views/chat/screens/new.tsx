import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/views/navigator';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';

export const newChatOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'NewChat'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'new chat',
    presentation: 'modal',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerLeft: () => (
      <IconButton
        icon="close"
        onPress={() => navigation.goBack()}
        style={styles.close}
      />
    ),
  };
};

const NewChat: React.FC = () => {
  const styles = getStyles(useTheme());

  const [selectedValue, setSelectedValue] = useState('option1');

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue: string, itemIndex: number) =>
          setSelectedValue(itemValue)
        }
      >
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
      </Picker>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {},
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
  });

export default NewChat;
