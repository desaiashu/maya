import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';
import { Message, Profile, SearchResult } from '@/data/types';
import { MessageList, InputToolbar, Search } from '@/views/chat/components';

export const discussionOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'discussion',
    headerTitle: '',
    presentation: 'card',
    headerShown: true,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="backarrow"
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconCloseContainer}
        style={styles.iconClose}
      />
    ),
  };
};

export interface DiscussionProps {
  prompt: Message;
  response: Message;
}

const Discussion: React.FC = () => {
  const styles = getStyles(useTheme());

  const route = useRoute();
  const { prompt, response } = route.params as DiscussionProps;

  const perspectives: Message[] = [prompt, response];
  const profiles: Profile[] = [
    { avatar: 'local://2199210.png', userid: '+16504305130', username: 'ashu' },
    { avatar: 'local://1473489.png', userid: 'maya', username: 'maya' },
    { avatar: 'local://butler.png', userid: 'system', username: 'system' },
  ];

  const results: SearchResult[] = [
    {
      title: 'GPU computing',
      url: 'https://boinc.berkeley.edu/wiki/GPU_computing',
    },
    {
      title: 'What are GPUs',
      url: 'https://www.worldcommunitygrid.org/help/topic.s?shortName=GPU',
    },
    {
      title: 'View source for GPU computing',
      url: 'https://boinc.berkeley.edu/w/?title=GPU_computing&action=edit',
    },
    {
      title: 'About GPUs | Compute Engine Documentation | Google Cloud',
      url: 'https://cloud.google.com/compute/docs/gpus/about-gpus',
    },
  ];

  const onSend = () => {};

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Words tag="h2">{'Points of view'}</Words>
        </View>
        <View style={styles.search}>
          <Search results={results} />
        </View>

        <MessageList
          messages={perspectives}
          profiles={profiles}
          style={styles.messages}
          info
        />
        {/* <InputToolbar onSend={onSend} /> */}
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
    keyboardAvoid: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      top: 8,
    },
    search: {
      top: 40,
    },
    messages: {
      marginTop: 50,
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
      width: 18,
      height: 18,
    },
  });

export default Discussion;
