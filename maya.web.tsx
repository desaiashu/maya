// maya.web.tsx = Web App Root

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import { ThemeProvider } from '@/ui/theme';
// import { Chat } from '@/views/chat';
import { Words } from '@/ui/atoms';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const MayaWeb = () => {
  console.log('Web version rendered');
  return (
    <Router>
      <ThemeProvider>
        <ActionSheetProvider>
          <Routes>
            <Route path="/">
              <Words tag="h5">Home Page</Words>
            </Route>
            <Route
              path="/chat/:slug"
              element={
                <div>
                  <Words tag="h5">Chat Page</Words>
                  {/* <Chat slug={useParams().slug} /> */}
                </div>
              }
            />
          </Routes>
        </ActionSheetProvider>
      </ThemeProvider>
    </Router>
  );
};

export default MayaWeb;
