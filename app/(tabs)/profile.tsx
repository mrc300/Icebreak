import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import GradientHeader from "../components/GradientHeader";

export default function ProfileScreen() {
  const user = {
    name: "Abhirukth",
    description: "Building IceBreak • CS @ UCPH",
    connections: 128,
    chats: 128,
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
      locations={[0.43, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <GradientHeader title="Profile" subtitle="My profile" />

      <View style={styles.content}>
        <View style={styles.centerWrapper}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/screens/profile/SettingsScreen")}
          >
            <Ionicons name="settings-sharp" size={28} color="#6FBAFF" />
          </TouchableOpacity>

          <View style={styles.centerSection}>
            <Avatar.Text
              size={150}
              label={user.name.charAt(0)}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.description}>{user.description}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard} elevation={2}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="person" size={24} color="#6FBAFF" />
              <Text style={styles.statNumber}>{user.connections}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </Card.Content>
          </Card>

          <Card
            style={styles.statCard}
            elevation={2}
            onPress={() => router.push("/screens/chat/MessagesScreen")}
          >
            <Card.Content style={styles.statContent}>
              <FontAwesome name="comment" size={24} color="#6FBAFF" />
              <Text style={styles.statNumber}>{user.chats}</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },

  centerWrapper: {
    position: "relative", // for absolute positioning of settings
    marginBottom: 24,
    alignItems: "center",
  },

  settingsButton: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },

  centerSection: {
    alignItems: "center",
  },

  avatar: {
    backgroundColor: "#6200ee",
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  description: {
    marginTop: 6,
    color: "#666",
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  statCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  statContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
  },

  statLabel: {
    color: "#666",
  },
});
