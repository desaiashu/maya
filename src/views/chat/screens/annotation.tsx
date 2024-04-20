import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';
import { Message, Profile, Confidence } from '@/data/types';
import {
  ConfidenceBadge,
  MessageList,
  InputToolbar,
} from '@/views/chat/components';

export const annotationOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'annotation',
    headerTitle: '',
    presentation: 'modal',
    headerShown: true,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="closex"
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconCloseContainer}
        style={styles.iconClose}
      />
    ),
  };
};

export interface AnnotationProps {
  prompt: Message;
  response: Message;
  confidence: Confidence;
}

const Annotation: React.FC = () => {
  const styles = getStyles(useTheme());

  const route = useRoute();
  const { prompt, response, confidence } = route.params as AnnotationProps;

  const notes: Message[] = [];
  const profiles: Profile[] = [];

  const onSend = () => {};

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <ConfidenceBadge confidence={confidence} />
          <Words tag="h1">{'yay'}</Words>
          {/* A high confidence means the answer is:
          Lower chance of bias Lower chance of hallucination Lower chance of
          misinformation Community notes Add note: Bias = Ruling party dominance
          Statements */}
        </View>
        <MessageList messages={notes} profiles={profiles} />
        <InputToolbar onSend={onSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: { flex: 1, alignItems: 'center' },
    keyboardAvoid: {
      flex: 1,
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
      width: 35,
      height: 35,
    },
    iconClose: {
      width: 19,
      height: 19,
    },
  });

export default Annotation;
