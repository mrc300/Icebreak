import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import GradientHeader from "../components/GradientHeader";

// Dummy data for posts
const posts = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "15min ago",
    content: "Having a great time in the conference!",
    likes: 12,
    comments: 4,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    time: "1h ago",
    content: "Just met this wonderful guy Bob!",
    likes: 8,
    comments: 2,
  },
  {
    id: "3",
    name: "Catherine Lee",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "4h ago",
    content: "Check out this amazing selfie spot!",
    likes: 20,
    comments: 5,
  },
];

export default function DiscoverScreen() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
      locations={[0.43, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <GradientHeader title="IceBreak" subtitle="Discover new connections" />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card} elevation={2}>
            <View style={styles.profileRow}>
              <Avatar.Image size={40} source={{ uri: item.avatar }} />
              <View style={styles.profileText}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>

            <Card.Content>
              <Text style={styles.postContent}>{item.content}</Text>
            </Card.Content>

            <Divider style={{ marginVertical: 8 }} />

            <View style={styles.reactions}>
              <View style={styles.reactionItem}>
                <AntDesign name="heart" size={20} color="red" />
                <Text style={styles.reactionNumber}>{item.likes}</Text>
              </View>
              <View style={styles.reactionItem}>
                <FontAwesome5 name="comment-alt" size={20} color="black" />
                <Text style={styles.reactionNumber}>{item.comments}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  profileText: {
    marginLeft: 12,
  },
  name: {
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  reactions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  reactionNumber: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
});
