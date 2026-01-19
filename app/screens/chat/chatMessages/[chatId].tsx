import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { chatPreview, times, users } from "../chatMessages/dummyChats";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const user = users[chatId as string];
  const messagesWithoutTime = chatPreview[chatId as string];

  if (!user || !messagesWithoutTime) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No conversation found.</Text>
      </View>
    );
  }

  // Prepare initial messages with timestamps
  const initialMessages = messagesWithoutTime.map((m, i) => ({
    ...m,
    time: times[i] ?? "09:41",
  }));

  const [chatMessages, setChatMessages] = React.useState(initialMessages);
  const [input, setInput] = React.useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me" as const,
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInput("");
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF", "#FFC8E9"]}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back-outline"
          size={26}
          color="#000"
          onPress={() => router.back()}
        />

        <Text style={styles.headerTitle}>{user.name}</Text>

        <Image source={user.avatar} style={styles.headerAvatar} />
      </View>

      {/* MESSAGES AREA */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const isMe = item.sender === "me";
            return (
              <View style={{ marginBottom: 12 }}>
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.meBubble : styles.themBubble,
                  ]}
                >
                  <Text style={isMe ? styles.meText : styles.themText}>
                    {item.text}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.time,
                    isMe ? styles.timeRight : styles.timeLeft,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.inputBar}>
          <Ionicons
            name="add-sharp"
            size={25}
            color="#006FFD"
            style={{ marginRight: 8 }}
          />

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={styles.input}
            onSubmitEditing={sendMessage}
          />

          {input.trim().length > 0 && (
            <Ionicons
              name="send"
              size={20}
              color="#007AFF"
              onPress={sendMessage}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 75,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bubble: {
    maxWidth: "75%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  meBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FFC8E9",
  },
  themBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  meText: {
    color: "#000",
    fontSize: 14,
  },
  themText: {
    color: "#000",
    fontSize: 14,
  },
  time: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.7,
  },
  timeLeft: { alignSelf: "flex-start" },
  timeRight: { alignSelf: "flex-end" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderColor: "transparentr",

    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#C7C7CC",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginRight: 6,
  },
});
