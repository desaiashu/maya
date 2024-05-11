import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Divider, IconButton, Words } from '@/ui/atoms';
import { Message, Profile, Confidence } from '@/data/types';
import { server } from '@/data';
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
    gestureEnabled: false,
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
  confidence?: Confidence;
  profiles: Profile[];
}

const Annotation: React.FC = () => {
  const styles = getStyles(useTheme());

  const route = useRoute();
  const { prompt, response, confidence, profiles } =
    route.params as AnnotationProps;

  useEffect(() => {
    server.getAnnotations([prompt, response]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const a: Message = {
    content:
      'A user left a note about this topic. They feel this information might be biased due to the funding sources of the studies. Their perspective was that...',
    sender: 'system',
    timestamp: 1,
    chatid: '1',
  };
  const notes: Message[] = [a];

  const onSend = () => {};

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <Words tag="h2" style={styles.rating}>
            {'Confidence rating'}
          </Words>
          <ConfidenceBadge
            confidence={confidence}
            tag={'body'}
            size={24}
            style={styles.confidence}
          />
          <Words tag="small" style={styles.explainer}>
            Confidence ratings are on a 0-100 scale
            {'\n'}
            {'\n'}A high confidence means the answer has
            {'\n'}- A lower chance of bias
            {'\n'}- A lower chance of hallucination
            {'\n'}- A lower chance of misinformation
            {'\n'}
            {'\n'}Our goal is to present a holistic perspective
            {'\n'}on info and seek ground truth, reducing
            {'\n'}cultural, political, and financial bias
            {'\n'}
            {'\n'}Please feel free to contribute more
            {'\n'}information on the topic at hand
          </Words>
          {/* We calculate bias using embeddings, identify hallucinations using
          secondary LLMs, and flag potential misinformation using community
          notes  */}
          {/* Since LLMs are trained on internet data, they only contain a
          small fraction of the world's information. Given this, we rely on our
          community to contribute additional information about topics discussed */}
          {/* A high confidence means the answer is:
          Lower chance of bias Lower chance of hallucination Lower chance of
          misinformation Community notes Add note: Bias = Ruling party dominance
          Statements */}
        </View>
        <Divider />
        <MessageList
          style={styles.messages}
          messages={notes}
          profiles={profiles}
          info
        />
        <InputToolbar
          placeholder={'Contribute information...'}
          onSend={onSend}
        />
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
    rating: { marginTop: -40, marginBottom: 30 },
    messages: { marginTop: 20, maxHeight: 300 },
    explainer: { fontSize: 12 },
    confidence: {
      width: 64,
      height: 64,
      borderRadius: 32,
      shadowRadius: 3,
      paddingTop: 5,
      //   marginTop: 10,
      //   marginLeft: 0,
      //   marginBottom: 0,
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
