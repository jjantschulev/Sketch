import React from 'react';
import { View } from 'react-native';

const MultiTouch = ({
  children,
  numTouches = 2,
  onTouchStart = () => null,
  onTouchMove = () => null,
  onTouchEnd = () => null,
}) => (
  <View
    onStartShouldSetResponder={evt => evt.nativeEvent.touches.length === numTouches
    }
    onMoveShouldSetResponder={evt => evt.nativeEvent.touches.length === numTouches
    }
    onResponderGrant={onTouchStart}
    onResponderMove={onTouchMove}
    onResponderRelease={onTouchEnd}
  >
    {children}
  </View>
);

export default MultiTouch;
