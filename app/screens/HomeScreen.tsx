import React from 'react';
import {Button} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/native-stack';

type RootStackParamList = {
  Profile: {name: string};
};

type HomeScreenProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    'Profile'
  >['navigation'];
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <Button
      title="Go to Profile example"
      onPress={() => navigation.navigate('Profile', {name: 'Example'})}
    />
  );
};

export default HomeScreen;
