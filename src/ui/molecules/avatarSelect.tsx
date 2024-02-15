import React from 'react';
import { FlatList, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { IconButton } from '@/ui/atoms';
import { humanAvatars } from '@/data';
import { Theme, useTheme } from '@/ui/theme';

const icons = Object.keys(humanAvatars);
interface AvatarSelectProps {
  selectedIndex: string;
  style: StyleProp<ViewStyle>;
  onSelect: (text: string) => void;
}

const AvatarSelect: React.FC<AvatarSelectProps> = ({
  selectedIndex,
  onSelect,
  style,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View style={item === selectedIndex ? styles.selectedItem : styles.item}>
        <IconButton
          icon={item}
          style={[styles.icon]}
          onPress={() => onSelect(item)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={icons}
        renderItem={renderItem}
        keyExtractor={item => item}
        numColumns={4}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 0,
      marginTop: 0,
      marginBottom: 0,
      height: 350,
    },
    item: {
      padding: 10,
    },
    selectedItem: {
      padding: 8,
      borderWidth: 2,
      borderColor: theme.colors.outline,
    },
    icon: {
      margin: 10,
    },
  });

export default AvatarSelect;
