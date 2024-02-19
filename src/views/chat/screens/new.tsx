import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/views/navigator';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Theme, useTheme } from '@/ui/theme';
import { Button, IconButton, Words } from '@/ui/atoms';
import { State, useStore, server, timestamp } from '@/data';
import { ChatInfo } from '@/data/types';
import ParticipantSelect from '@/ui/molecules/participantSelect';

export const newChatOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'NewChat'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'new',
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
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      server.refreshChatlist();
    }, []),
  );

  const { protocols, user, bots } = useStore((state: State) => ({
    protocols: state.protocols,
    user: state.currentUser,
    bots: state.bots,
  }));

  const [protocol, setProtocol] = useState(protocols[2]);
  const [participants, setParticipants] = useState<string[]>([]);

  const save = () => {
    const chat: ChatInfo = {
      chatid: 'new',
      creator: user.userid,
      participants: [...participants, user.userid],
      topic: 'new chat',
      protocol: protocol,
      profiles: [],
      created: timestamp(),
      updated: timestamp(),
    };
    server.createChat(chat);
    navigation.goBack();
    navigation.navigate('Chat', chat);
  };
  //Also respond to chatUpdate

  return (
    <View style={styles.container}>
      <Words tag="h4" style={styles.info}>
        choose protocol:
      </Words>
      <Picker
        selectedValue={protocol}
        onValueChange={itemValue => setProtocol(itemValue)}
        style={styles.picker}
        itemStyle={[theme.fonts.large, styles.pickerItem]}
      >
        {protocols.map(p => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>
      <Words tag="h4" style={styles.participants}>
        select participants:
      </Words>
      <ParticipantSelect
        participants={bots}
        selected={participants}
        setSelected={setParticipants}
      />
      <Button
        outlined
        title="create chat"
        style={styles.save}
        onPress={save}
        disabled={participants.length === 0 ? true : false}
      />
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
    info: {
      marginTop: 0,
    },
    participants: {
      marginTop: 10,
      marginBottom: 25,
      textAlign: 'left',
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    picker: {
      width: '80%',
    },
    pickerItem: {
      color: theme.colors.text.primary,
    },
    save: {
      marginTop: 40,
      // marginBottom: 30,
    },
  });

export default NewChat;
