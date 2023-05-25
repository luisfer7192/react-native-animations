import React from 'react';
import {Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

type RootStackParamList = {
  Profile: {name: string};
};

const ProfileScreen = ({
  route,
}: StackScreenProps<RootStackParamList, 'Profile'>) => {
  const {name} = route.params;
  return <Text>This is {name}'s profile</Text>;
};

export default ProfileScreen;
