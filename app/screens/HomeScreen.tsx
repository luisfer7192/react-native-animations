import React from 'react';
import {Button} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/native-stack';
import AnimatedComponent from '../components/AnimatedComponent';
import DrawerMenu from '../components/DrawerMenu';

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
      <DrawerMenu navigation={navigation} />
      {/* <Button
        title="Go to Profile example"
        onPress={() => navigation.navigate('Profile', {name: 'Example'})}
      />
      <AnimatedComponent /> */}
    </>
  );
};

export default HomeScreen;
