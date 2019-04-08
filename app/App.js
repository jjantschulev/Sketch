import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './AppNavigator';
import { store, persistor } from './redux/configureStore';
import Colors from './tools/Colors';

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme,
    primary: Colors.primary,
    accent: Colors.accent,
    background: Colors.background,
    text: Colors.light,
  },
};

const App = () => (
  <ReduxProvider store={store}>
    <PaperProvider theme={theme}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </PaperProvider>
  </ReduxProvider>
);

export default App;
