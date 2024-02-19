import React from 'react';
import { Profile } from '@/data/types';
import {
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Avatar, Words } from '@/ui/atoms';
import { useTheme, Theme } from '@/ui/theme';
import { getImageSource } from '@/data';

interface ParticipantSelectProps {
  participants: Profile[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const ParticipantSelect: React.FC<ParticipantSelectProps> = props => {
  const { participants, selected, setSelected } = props;

  const styles = getStyles(useTheme());
  const colorScheme = useColorScheme();

  const handleSelect = (s: string) => {
    setSelected(prev => {
      if (prev.find(p => p === s)) {
        console.log('found');
        return prev.filter(p => p !== s);
      } else {
        console.log('not');
        return [...prev, s];
      }
    });
  };

  const renderProfile = ({ item }: { item: Profile }) => {
    let profile = item;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleSelect(profile.userid)}
      >
        <View style={styles.left}>
          <Avatar avatar={profile.avatar} size={25} />
          <Words tag="body" style={styles.name}>
            {profile.username}
          </Words>
        </View>
        {selected.includes(profile.userid) && (
          <FastImage
            source={getImageSource('check', colorScheme)}
            style={styles.check}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={participants}
        renderItem={renderProfile}
        keyExtractor={item => item.userid}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      maxHeight: '25%',
      minWidth: '75%',
    },
    content: {},
    itemContainer: {
      paddingLeft: 28,
      borderRadius: 10,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.header,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      height: 50,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: 20,
      fontSize: 16,
    },
    check: {
      width: 20,
      height: 20,
      marginRight: 20,
    },
  });

export default ParticipantSelect;
