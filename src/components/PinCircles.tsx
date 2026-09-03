import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  length: number;
  total?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
};

export default function PinCircles({ length, total = 4, size = 20, filledColor = '#FFFFFF', emptyColor = 'rgba(255,255,255,0.32)' }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i < length ? filledColor : 'transparent',
              borderColor: i < length ? filledColor : emptyColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center' },
  dot: { borderWidth: 3 },
});
