/**
 * @format
 */

import 'react-native';
import React from 'react';
import Maya from '../maya';

// Note: import explicitly to use the types shipped with jest.
import { it } from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Maya />);
});

// Tests:
// 1. Login flow
//    - If users exists on server
//    - If user does not exist on server
//        - If user exits app after authentication but before profile creation
// 2. Chat flow
// 3. New chat flow
// 4. Profile/settings flow
