import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Button, IconButton, Input, Words } from '@/ui/atoms';
import { State, useStore, server } from '@/data';
import { Profile } from '@/data/types';
import { AvatarSelect } from '@/ui/molecules';

export const annotationOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'annotation',
    headerTitle: '',
    presentation: 'modal',
    headerShown: false,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="close"
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconCloseContainer}
        style={styles.iconClose}
      />
    ),
  };
};

const Annotation: React.FC = () => {
  const styles = getStyles(useTheme());
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { params } = route;
  const { user, updateUserChats, setUserProfile } = useStore(
    (state: State) => ({
      user: state.currentUser,
      updateUserChats: state.updateUserChats,
      setUserProfile: state.setUserProfile,
    }),
  );

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  if (user === null) {
    return null;
  }

  const save = () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View
          style={[styles.container, keyboardVisible && styles.keyboardVisibile]}
        >
          <View>
            <View>
              <Words tag="h4" style={styles.top}>
                select avatar
              </Words>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    keyboardAvoid: {
      flex: 1,
    },
    keyboardVisibile: {
      marginBottom: 0,
    },
    top: {
      marginLeft: 10,
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    save: {},
    iconCloseContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 1,
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 1,
      marginTop: 5,
      marginLeft: -3,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    iconClose: {
      width: 33,
      height: 33,
    },
  });

export default Annotation;
