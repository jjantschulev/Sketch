import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StatusBar, FlatList } from 'react-native';
import { IconButton, Button, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../tools/Colors';
import Confirm from '../components/Confirm';

const HomeScreen = ({ sketches, navigation, dispatch }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
    <StatusBar
      backgroundColor={Colors.darkBackground}
      barStyle="light-content"
    />
    <FlatList
      data={sketches}
      contentContainerStyle={{ padding: 20 }}
      ListHeaderComponent={(
        <Button
          style={{ marginBottom: 5 }}
          mode="contained"
          onPress={() => {
            dispatch({ type: 'NEW_SKETCH' });
            navigation.navigate('Editor', { index: sketches.length });
          }}
        >
          <Icon name="add-circle-outline" size={32} />
        </Button>
)}
      renderItem={({ item, index }) => (
        <List.Item
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.primary,
            marginVertical: 5,
          }}
          title={item.name}
          right={props => (
            <IconButton
              {...props}
              icon="delete"
              color={Colors.red}
              onPress={async () => {
                const sure = await Confirm(
                  'Are You Sure',
                  'This will delete this sketch. This cannot be undone',
                );
                if (!sure) return;
                dispatch({ type: 'DELETE_SKETCH', index });
              }}
            />
          )}
          onPress={() => navigation.navigate('Editor', { index })}
        />
      )}
      keyExtractor={(item, i) => i.toString()}
    />
  </SafeAreaView>
);

HomeScreen.navigationOptions = ({ navigation }) => ({
  title: 'Sketch',
  headerRight: (
    <IconButton
      color={Colors.light}
      icon="settings"
      onPress={() => navigation.navigate('Settings')}
    />
  ),
});

export default connect(state => state)(HomeScreen);
