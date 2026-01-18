import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import GradientHeader from "../components/GradientHeader";

export default function DiscoverScreen() {
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
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 16,
  },
});
