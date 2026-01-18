import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  name: string;
  avatar: any;
};

type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
};

const users: Record<string, User> = {
  "1": { name: "Haley James", avatar: require("../../assets/images/dummy_avatars/avatar1.jpg") },
  "2": { name: "Nathan Scott", avatar: require("../../assets/images/dummy_avatars/avatar2.jpg") },
  "3": { name: "Brooke Davis", avatar: require("../../assets/images/dummy_avatars/avatar3.jpg") },
  "4": { name: "Marvin McFadden", avatar: require("../../assets/images/dummy_avatars/avatar4.jpg") },
  "5": { name: "Peyton Sawyer", avatar: require("../../assets/images/dummy_avatars/avatar5.jpg") },
};


const chatPreview: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "them", text: "Are you coming tonight?" },
    { id: "m2", sender: "me", text: "Maybe! Who else is going?" },
  ],
  "2": [
    { id: "m3", sender: "them", text: "Stand up for what you believe in" },
  ],
  "3": [
    { id: "m4", sender: "them", text: "Hey Lucas!" },
    { id: "m5", sender: "me", text: "Hi Brooke!" },
    { id: "m6", sender: "them", text: "How's your project going?" },
  ],
  "4": [
    { id: "m7", sender: "them", text: "What are you up to?" },
  ],
  "5": [
    { id: "m8", sender: "them", text: "Hey! What's up ?!" },
  ],
};


const chatList = Object.entries(chatPreview).map(([userId, messages]) => {
  const last = messages[messages.length - 1];
  
  // Random sample time (but you can hardcode too)
  const times = ["08:20", "09:44", "15:24", "20:10", "00:12"];
  
  return {
    userId,
    lastMessage: last.text,
    time: times[Number(userId) - 1] ?? "09:41",
    unread: ["1", "3", "5"].includes(userId), // mark these as UNREAD
  };
});


export default function MessagesScreen() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF", "#FFC8E9"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      
          <View style={styles.header}>
            <Ionicons name="chevron-back-outline" size={24} color="#000" />
            <Text style={styles.headerTitle}>Chats</Text>
            <View style={{ width: 24 }} /> {/* placeholder to center title */}
          </View>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const user = users[item.userId];

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/chats/[chatId]",
                  params: { chatId: item.userId },
                })
              }
            >
              <Image source={user.avatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text
                  style={[styles.preview, item.unread && styles.previewUnread]}
                >
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={[styles.time, item.unread && styles.timeUnread]}>
                {item.time}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.footerNote}>Chats disappear after 1 week</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 16,
  marginBottom: 50
  ,
},
headerTitle: {
  fontSize: 20,
  fontWeight: "600",
},

  headerText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    paddingVertical: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  previewUnread: {
    fontWeight: "600",
    color: "#111",
  },
  time: {
    fontSize: 11,
    color: "#666",
    marginLeft: 8,
    fontWeight: "400",
  },
  timeUnread: {
    fontWeight: "600",
    color: "#111",
  },


  footerNote: {
  textAlign: "center",
  fontSize: 12,
  color: "#555",
  opacity: 0.7,
  marginBottom: 15,
  marginTop: 4,
},

});
