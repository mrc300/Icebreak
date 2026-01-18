import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ---- Dummy Data ---- //
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
    avatar:  require("../../assets/images/dummy_avatars/avatar1.jpg"),
  },
  "3": {
    name: "Brooke Davis",
    avatar: require("../../assets/images/dummy_avatars/avatar2.jpg"),
  },
};

const chats: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "them", text: "What are you up to?" },
    { id: "m2", sender: "me", text: "Studying for tomorrow!" },
    { id: "m3", sender: "them", text: "Nice! Good luck!" },
  ],
  "3": [
    { id: "m1", sender: "them", text: "Hey Lucas!" },
    { id: "m2", sender: "me", text: "Hi Brooke!" },
    { id: "m3", sender: "them", text: "How's your project going?" },
  ],
};

// ---- Screen Component ---- //
export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const navigation = useNavigation();

  const user = users[chatId as string];
  const [messages, setMessages] = useState<Message[]>(
    chats[chatId as string] || [],
  );
  const [input, setInput] = useState("");

  // Set header title dynamically
  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: user.name,
        headerTitleAlign: "center",
      });
    }
  }, [navigation, user]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "me", text: input },
    ]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90} // adjusts for header
    >
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === "me" ? styles.meBubble : styles.themBubble,
            ]}
          >
            <Text
              style={item.sender === "me" ? styles.meText : styles.themText}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={`Message ${user?.name}`}
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

// ---- Styles ---- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  messagesContainer: {
    padding: 12,
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    maxWidth: "80%",
    borderRadius: 18,
  },
  meBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  themBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  meText: {
    color: "white",
  },
  themText: {
    color: "black",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 18,
    paddingHorizontal: 12,
    marginRight: 8,
    height: 40,
  },
});
