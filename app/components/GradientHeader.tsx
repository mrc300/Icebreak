import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#A4E4FF", "#FED1FD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: "transparent",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android shadow
    elevation: 6,
  },
  container: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
