/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
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
import MenuButton from '../MenuButton';

interface DrawerMenuProps extends HomeScreenProps {
  children?: JSX.Element;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const THRESHOLD = SCREEN_WIDTH / 3;

function DrawerMenu({navigation, children}: DrawerMenuProps) {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const drawerTranslateY = useSharedValue(0); // New shared value for drawer translation on the Y-axis

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_, context) => {
      context.x = translateX.value;
      context.y = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(event.translationX + context.x, 0);
      translateY.value = Math.max(event.translationY + context.y, 0);
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        rotation.value = withTiming(0);
      } else {
        translateX.value = withTiming(SCREEN_WIDTH / 2);
        translateY.value = withTiming(30);
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
        {translateY: translateY.value},
        {rotate: `${rotation.value}deg`},
      ],
    };
  }, []);

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: drawerTranslateY.value}],
    };
  });

  const onPress = useCallback(() => {
    if (translateX.value > 0) {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      rotation.value = withTiming(0);
      drawerTranslateY.value = withTiming(0);
    } else {
      translateX.value = withTiming(SCREEN_WIDTH / 1.5);
      translateY.value = withTiming(30);
      rotation.value = withTiming(-15);
      drawerTranslateY.value = withTiming(30); // Animate the drawer to move down by 30px
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
      <Animated.View style={[styles.drawer, drawerStyle]}>
        <View style={styles.drawerContainer}>
          <Text style={styles.menuTitle}>Beka</Text>
          <MenuButton
            onPress={() => navigation.navigate('Profile', {name: 'Example'})}
            label="START"
            selected
          />
          <MenuButton
            onPress={() => navigation.navigate('Profile', {name: 'Example'})}
            label="Your Cart"
          />
          <MenuButton
            onPress={() => navigation.navigate('Profile', {name: 'Example'})}
            label="Favourites"
          />
          <MenuButton
            onPress={() => navigation.navigate('Profile', {name: 'Example'})}
            label="Your Orders"
          />
          <View style={styles.line} />
          <MenuButton
            onPress={() => navigation.navigate('Profile', {name: 'Example'})}
            label="Sigh Out"
          />
        </View>
      </Animated.View>
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
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: '#16162A',
    zIndex: 0,
    alignItems: 'flex-start',
    paddingTop: 120,
    paddingLeft: 25,
    borderTopLeftRadius: 30,
  },
  drawerContainer: {
    width: SCREEN_WIDTH / 2.3,
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
  menuTitle: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center',
    fontWeight: '900',
    marginBottom: 20,
  },
  drawerSelectionContainer: {
    backgroundColor: '#3F2838',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  line: {
    width: 160,
    height: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF54',
    marginVertical: 30,
  },
});
