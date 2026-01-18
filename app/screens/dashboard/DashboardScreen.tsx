import GradientHeader from "@/app/components/GradientHeader";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <GradientHeader title="IceBreak" subtitle="Discover new connections" />

      <View style={styles.content}>
        <Text>Your local feed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
