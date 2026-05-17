import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
};

export default function GameLandscapeFrame({ children, backgroundColor = '#2D1B69' }: Props) {
  return (
    <View style={[styles.fill, { backgroundColor }]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
