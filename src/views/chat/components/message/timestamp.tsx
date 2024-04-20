import React from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import * as RNLocalize from 'react-native-localize';
import Words from '@/ui/atoms/words';
import { Theme, useTheme } from '@/ui/theme';

const DATE_FORMAT = 'll';
const TIME_FORMAT = 'LT';
const LOCALE = RNLocalize.getLocales()[0].languageCode;
dayjs.extend(localizedFormat);

interface DayProps {
  timestamp: number;
}

export const Day: React.FC<DayProps> = ({ timestamp }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.day.container}>
      <Words tag="h5" style={styles.day.text}>
        {dayjs(timestamp).locale(LOCALE).format(DATE_FORMAT)}
      </Words>
    </View>
  );
};

interface TimeProps {
  timestamp: number;
  position: 'left' | 'right';
}

export const Time: React.FC<TimeProps> = ({ timestamp, position }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.time.container}>
      <Words tag="tiny" style={[styles.time.text, styles.time[position]]}>
        {dayjs(timestamp).locale(LOCALE).format(TIME_FORMAT)}
      </Words>
    </View>
  );
};

const getStyles = (theme: Theme) => ({
  day: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
    text: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.outline,
      marginTop: 0,
      marginBottom: 20,
    },
  }),
  time: StyleSheet.create({
    container: {
      marginBottom: 5,
    },
    text: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.outline,
    },
    left: {
      textAlign: 'left',
      paddingBottom: -1,
      marginLeft: -4,
    },
    right: {
      textAlign: 'right',
      paddingBottom: -1,
      marginRight: -4,
    },
  }),
});
