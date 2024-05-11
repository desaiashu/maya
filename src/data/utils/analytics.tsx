import * as amplitude from '@amplitude/analytics-react-native';
import { AMPLITUDE_KEY } from './config';
import { Platform } from 'react-native';

class AnalyticsClient {
  constructor() {
    this.initialize();
  }

  initialize() {
    amplitude.init(AMPLITUDE_KEY);
  }

  set_user(userid: string) {
    amplitude.setUserId(userid);
  }

  track(
    event: amplitude.Types.BaseEvent | string,
    props?: Record<string, any>,
  ) {
    amplitude.track(event, { ...props, platform: Platform.OS });
  }
}

export const analytics = new AnalyticsClient();
