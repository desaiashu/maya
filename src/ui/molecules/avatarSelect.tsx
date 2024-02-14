import React, { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { IconButton } from '@/ui/atoms';
import { localAvatars } from '@/data';

const icons = Object.keys(localAvatars);
interface AvatarSelectProps {
    selectedIndex: string;
}

const AvatarSelect: React.FC<AvatarSelectProps> = (selectedIndex) => {

    const [selectedIcon, setSelectedIcon] = useState(selectedIndex);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.item}>
        <IconButton icon={item} style={styles.icon} onPress={() => setSelectedIcon(item)}/>
    </View>
  );

  return (
    <FlatList
      data={icons}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={3}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        padding: 10,
    },
    selectedItem: {

    },
    icon: {
        margin: 10,
    },
});

export default AvatarSelect;