import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  title: string;
  subtitle?: string;
};

export default function GradientHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: "transparent",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    // shadowColor: "#000",
    // shadowOpacity: 0.12,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 6 },

    // elevation: 6,
  },
  container: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "bold",
    color: "#555",
  },
  subtitle: {
    marginTop: 4,
    color: "#555",
  },
});
