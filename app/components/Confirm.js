import { Alert } from 'react-native';

const Confirm = (title, message) => new Promise((res) => {
  Alert.alert(title, message, [
    { text: 'Cancel', onPress: () => res(false) },
    { text: 'OK', onPress: () => res(true) },
  ]);
});

export default Confirm;
