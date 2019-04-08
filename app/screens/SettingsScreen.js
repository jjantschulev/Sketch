import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import Colors from '../tools/Colors';

const SettingsScreen = () => (
  <SafeAreaView
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
    }}
  >
    <Text>There are currently no settings.</Text>
  </SafeAreaView>
);

SettingsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Settings',
  headerLeft: (
    <IconButton
      color={Colors.light}
      icon="arrow-back"
      onPress={() => navigation.goBack()}
    />
  ),
});

const mapStateToProps = state => state.settings;

export default connect(mapStateToProps)(SettingsScreen);
