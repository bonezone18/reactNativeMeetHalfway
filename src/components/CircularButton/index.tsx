import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

interface CircularButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CircularButton: React.FC<CircularButtonProps> = ({
  onPress,
  disabled = false,
  size = 120,
  backgroundColor = '#2ECC71', // Emerald green from Flutter app
  textColor = '#FFFFFF',
  fontSize = 20,
  text = 'Meet!',
  style,
  textStyle,
}) => {
  const buttonStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: disabled ? '#A0A0A0' : backgroundColor,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CircularButton;
