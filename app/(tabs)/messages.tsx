import { router } from "expo-router";
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
  "1": {
    name: "Haley James",
    avatar: require("../../assets/images/dummy_avatars/avatar1.jpg"),
  },
  "2": { name: "Nathan Scott", avatar: "./path " },
  "3": {
    name: "Brooke Davis",
    avatar: require("../../assets/images/dummy_avatars/avatar2.jpg"),
  },
};

const chatPreview: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "them", text: "What are you up to?" },
    { id: "m2", sender: "me", text: "Studying for tomorrow!" },
  ],
  "3": [
    { id: "m3", sender: "them", text: "Hey Lucas!" },
    { id: "m4", sender: "me", text: "Hi Brooke!" },
  ],
};

// Convert to array for FlatList
const chatList = Object.entries(chatPreview).map(([userId, messages]) => {
  const last = messages[messages.length - 1];
  return {
    userId,
    lastMessage: last.text,
    time: "09:41",
  };
});

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => {
          const user = users[item.userId];

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: "/chats/[chatId]",
                  params: { chatId: item.userId },
                })
              }
            >
              <Image source = {user.avatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.preview}>{item.lastMessage}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { fontWeight: "bold", fontSize: 16 },
  preview: { color: "#555", marginTop: 4 },
  time: { fontSize: 12, color: "#999", marginLeft: 8 },
});
