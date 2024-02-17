import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Theme, useTheme } from '@/ui/theme';
import * as RNLocalize from 'react-native-localize';

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
      <Text style={[theme.fonts.h5, styles.day.text]}>
        {dayjs(timestamp).locale(LOCALE).format(DATE_FORMAT)}
      </Text>
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
      <Text style={[theme.fonts.tiny, styles.time.text, styles.time[position]]}>
        {dayjs(timestamp).locale(LOCALE).format(TIME_FORMAT)}
      </Text>
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
      color: theme.colors.text.secondary,
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
      color: theme.colors.text.secondary,
    },
    left: {
      textAlign: 'left',
      paddingBottom: 0.5,
      marginLeft: 8,
    },
    right: {
      textAlign: 'right',
      paddingBottom: 2,
      marginRight: 8,
    },
  }),
});
