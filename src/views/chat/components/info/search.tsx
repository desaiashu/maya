import React from 'react';
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { Words } from '@/ui/atoms';
import { SearchResult } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { analytics, WEB_DESKTOP } from '@/data';

interface ResultProps {
  results: SearchResult[];
}

const Search: React.FC<ResultProps> = props => {
  const { results } = props;
  const styles = getStyles(useTheme());

  const onPress = (r: SearchResult) => {
    analytics.track('open_search');
    Linking.openURL(r.url);
  };

  const domain = (url: string) => {
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    // The domain will be in the first capturing group
    let d = matches && matches[1];
    if (d) {
      // Strip 'www.' from the start of the domain if it exists
      d = d.replace(/^www\./, '');
    }
    return d || url;
  };

  return (
    <View style={styles.container}>
      {results.map((r, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, styles.shadow]}
          onPress={() => onPress(r)}
        >
          <Words tag={'h5'} style={styles.title}>
            {r.title}
          </Words>
          <Words tag={'tiny'} style={styles.url}>
            {domain(r.url)}
          </Words>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row', // This makes child components align horizontally
      // alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: 0,
      paddingBottom: 0,
      marginLeft: '-6%',
    },
    button: {
      backgroundColor: theme.colors.background,
      borderRadius: 3,
      paddingTop: 5,
      paddingBottom: 4,
      paddingLeft: 6,
      paddingRight: 6,
      marginBottom: 3,
      marginLeft: 4,
      marginRight: 4,
      width: '20.5%',
    },
    shadow: {
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    title: {
      height: WEB_DESKTOP ? 50 : 30,
      fontSize: WEB_DESKTOP ? 12 : 10,
      marginTop: WEB_DESKTOP ? 3 : 0,
      marginBottom: 0,
      overflow: 'hidden',
    },
    url: {
      height: 10,
      marginTop: WEB_DESKTOP ? 5 : 0,
      marginBottom: WEB_DESKTOP ? 5 : 0,
      fontSize: WEB_DESKTOP ? 9 : 7,
    },
  });

export default Search;
