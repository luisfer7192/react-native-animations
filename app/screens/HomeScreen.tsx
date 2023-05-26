import React from 'react';
import {NativeStackScreenProps} from 'react-native-screens/native-stack';
import DrawerMenu from '../components/DrawerMenu';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet, Text} from 'react-native';

type RootStackParamList = {
  Profile: {name: string};
};

export type HomeScreenProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    'Profile'
  >['navigation'];
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <DrawerMenu navigation={navigation}>
          <Text>Content page here</Text>
        </DrawerMenu>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e23',
  },
});

export default HomeScreen;
