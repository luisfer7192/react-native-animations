import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';

interface MenuButtonProps {
  selected?: boolean;
  label: string;
  onPress: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  selected = false,
  label,
  onPress,
}) => {
  const textStyle = selected ? styles.selectedText : styles.unselectedText;
  const containerStyle = selected
    ? styles.selectedContainer
    : styles.unselectedContainer;

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 10,
    alignItems: 'flex-start',
    maxWidth: 170,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  selectedContainer: {
    backgroundColor: '#3F2838',
  },
  unselectedContainer: {},
  selectedText: {
    color: '#EC6D5C',
  },
  unselectedText: {
    color: 'white',
  },
});

export default MenuButton;
