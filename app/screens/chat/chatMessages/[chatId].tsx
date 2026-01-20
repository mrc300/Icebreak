import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<{
    name: string;
    avatar_url: string | null;
  } | null>(null);

  // 🔹 Load current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load messages + other user + realtime
  useEffect(() => {
    if (!chatId) return;

    loadMessages();
    loadOtherUser();

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      if (!chatId || !currentUserId) return;

      const markRead = async () => {
        const { error } = await supabase
          .from("chat_members")
          .update({ last_read_at: new Date().toISOString() })
          .eq("chat_id", chatId)
          .eq("user_id", currentUserId);

        console.log("markRead error:", error);
      };

      markRead();
    }, [chatId, currentUserId]),
  );

  // 1️⃣ Load messages
  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    setMessages(data ?? []);
  }

  // 2️⃣ Load other user
  async function loadOtherUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: member } = await supabase
      .from("chat_members")
      .select("user_id")
      .eq("chat_id", chatId)
      .neq("user_id", user.id)
      .single();

    if (!member) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", member.user_id)
      .single();

    setOtherUser(profile);
  }

  async function sendMessage() {
    if (!input.trim() || !currentUserId) return;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      content: input,
      created_at: new Date().toISOString(),
    };

    // 1️⃣ Show instantly
    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    // 2️⃣ Save to DB
    await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: currentUserId,
      content: optimisticMessage.content,
    });
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

        <Text style={styles.headerTitle}>{otherUser?.name ?? "Chat"}</Text>

        {otherUser?.avatar_url ? (
          <Image
            source={{ uri: otherUser.avatar_url }}
            style={styles.headerAvatar}
          />
        ) : (
          <View style={styles.headerAvatar} />
        )}
      </View>

      {/* MESSAGES */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const isMe = item.sender_id === currentUserId;

            return (
              <View style={{ marginBottom: 12 }}>
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.meBubble : styles.themBubble,
                  ]}
                >
                  <Text style={isMe ? styles.meText : styles.themText}>
                    {item.content}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.time,
                    isMe ? styles.timeRight : styles.timeLeft,
                  ]}
                >
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
        />

        {/* INPUT */}
        <View style={styles.inputBar}>
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
