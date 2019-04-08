import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import Colors from './tools/Colors';
import Editor from './screens/Editor';

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
    Editor: { screen: Editor },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.darkBackground,
      },
      headerTitleStyle: {
        color: Colors.light,
      },
      headerBackTitleStyle: {
        color: Colors.light,
      },
    },
  },
);

export default createAppContainer(AppNavigator);
