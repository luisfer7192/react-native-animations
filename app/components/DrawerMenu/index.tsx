/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  Button,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {HomeScreenProps} from '../../screens/HomeScreen';

interface DrawerMenuProps extends HomeScreenProps {}
interface MenuProps extends DrawerMenuProps {}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const THRESHOLD = SCREEN_WIDTH / 3;

function Menu({navigation}: MenuProps) {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0); // New shared value for rotation

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number}
  >({
    onStart: (_, context) => {
      context.x = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(event.translationX + context.x, 0);
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
        rotation.value = withTiming(0); // Reset rotation when gesture ends
      } else {
        translateX.value = withTiming(SCREEN_WIDTH / 2);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 35],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [
        {perspective: 100},
        {
          translateX: translateX.value,
        },
        // We use rotation.value here instead of a static '-8deg'
        {rotate: `${rotation.value}deg`},
      ],
    };
  }, []);

  const onPress = useCallback(() => {
    if (translateX.value > 0) {
      translateX.value = withTiming(0);
      rotation.value = withTiming(0); // Reset rotation when button is pressed
    } else {
      translateX.value = withTiming(SCREEN_WIDTH / 2);
      rotation.value = withTiming(-8); // Rotate by -8 degrees when button is pressed
    }
  }, []);

  return (
    <SafeAreaView style={[styles.container, styles.safe]}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View
          style={[
            {
              backgroundColor: 'white',
              flex: 1,
              zIndex: 10,
              alignItems: 'flex-start',
            },
            rStyle,
          ]}>
          <Button title="Menu" onPress={onPress} />
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.drawer}>
        <Button
          title="Go to Profile example"
          onPress={() => navigation.navigate('Profile', {name: 'Example'})}
        />
      </View>
    </SafeAreaView>
  );
}

const DrawerMenu = ({navigation}: DrawerMenuProps) => {
  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: BACKGROUND_COLOR}}>
      <Menu navigation={navigation} />
    </GestureHandlerRootView>
  );
};

export default DrawerMenu;

const BACKGROUND_COLOR = '#1e1e23';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  safe: {
    // workaround for the SafeAreaView in Android (use the react-native-safe-area-context package)
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: '#ddd',
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
