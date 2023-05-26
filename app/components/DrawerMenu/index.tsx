/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
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

interface DrawerMenuProps extends HomeScreenProps {
  children?: JSX.Element;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const THRESHOLD = SCREEN_WIDTH / 3;

function DrawerMenu({navigation, children}: DrawerMenuProps) {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0); // New shared value for rotation
  const translateY = useSharedValue(0); // Nueva variable compartida para la translación en Y

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number} // Agrega el valor compartido para la translación en Y
  >({
    onStart: (_, context) => {
      context.x = translateX.value;
      context.y = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(event.translationX + context.x, 0);
      translateY.value = Math.max(event.translationY + context.y, 0); // Actualiza el valor de la translación en Y
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0); // Resetea la translación en Y cuando finaliza el gesto
        rotation.value = withTiming(0);
      } else {
        translateX.value = withTiming(SCREEN_WIDTH / 2);
        rotation.value = withTiming(-15);
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
        {translateX: translateX.value},
        {translateY: translateY.value}, // Agrega la translación en Y animada
        {rotate: `${rotation.value}deg`},
      ],
    };
  }, []);

  const onPress = useCallback(() => {
    if (translateX.value > 0) {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      rotation.value = withTiming(0); // Reset rotation when button is pressed
    } else {
      translateX.value = withTiming(SCREEN_WIDTH / 1.5);
      translateY.value = withTiming(30); // Add downward translation animation of 30px
      rotation.value = withTiming(-15); // Rotate by -15 degrees when button is pressed
    }
  }, []);

  return (
    <View style={[styles.container, styles.safe]}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.animatedContainer, rStyle]}>
          <TouchableOpacity onPress={onPress} style={styles.menuContainer}>
            <Image
              source={require('../../assets/menu-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.menuText}>START</Text>
          </TouchableOpacity>
          {children}
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.drawer}>
        <Button
          title="Go to Profile example"
          onPress={() => navigation.navigate('Profile', {name: 'Example'})}
        />
      </View>
    </View>
  );
}

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
    alignItems: 'flex-start',
    // justifyContent: 'center',
  },
  animatedContainer: {
    backgroundColor: 'white',
    flex: 1,
    zIndex: 10,
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingLeft: 30,
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 20,
    opacity: 0.2,
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    color: '#888',
    fontSize: 20,
    letterSpacing: 3,
  },
});
