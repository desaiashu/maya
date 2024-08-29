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
    setTimeout(() => {
      amplitude.track(event, { ...props, platform: Platform.OS });
    }, 50);
  }
}

export const analytics = new AnalyticsClient();
