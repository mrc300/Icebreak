import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";
import { useCallback } from "react";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ChatItem = {
  chatId: string;
  lastMessage: string;
  time: string;
  name: string;
  avatarUrl: string | null;
   isUnread: boolean; 
};

export default function MessagesScreen() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useFocusEffect(
      useCallback(() => {
        supabase.auth.getUser().then(({ data }) => {
          setCurrentUserId(data.user?.id ?? null);
        });

        loadChats();
      }, [])
    );

  async function loadChats() {
    setLoading(true);

    

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("LOGGED IN USER ID:", user?.id);
    if (!user) return;

    // 1️⃣ Get chat IDs
    const { data: memberships, error } = await supabase
      .from("chat_members")
      .select("chat_id")
      .eq("user_id", user.id);
    console.log("MEMBERSHIPS:", memberships);
    console.log("MEMBERSHIPS ERROR:", error);
    if (!memberships || memberships.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    const chatIds = memberships.map((m) => m.chat_id);

    const { data: members } = await supabase
      .from("chat_members")
      .select("chat_id, user_id, last_read_at")
      .in("chat_id", chatIds);

    console.log("OTHER MEMBERS:", members);
    // 3️⃣ Get profiles
    const userIds = members?.map((m) => m.user_id) ?? [];
    console.log("OTHER USER IDS:", userIds);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .in("id", userIds);
    console.log("PROFILES:", profiles);
    // 4️⃣ Get last messages
    const { data: messages } = await supabase
      .from("messages")
      .select("chat_id, content, created_at, sender_id")

      .in("chat_id", chatIds)
      .order("created_at", { ascending: false });

    // Build lookup maps (THIS is the key)
    const myMemberByChat = new Map(
  members
    ?.filter(m => m.user_id === user.id)
    .map(m => [m.chat_id, m])
);

const otherMemberByChat = new Map(
  members
    ?.filter(m => m.user_id !== user.id)
    .map(m => [m.chat_id, m])
);


    const profileById = new Map(profiles?.map((p) => [p.id, p]));
    console.log("profileById:", Array.from(profileById.entries()));

    const results: ChatItem[] = chatIds.map((chatId) => {
     const otherMember = otherMemberByChat.get(chatId);
const profile = otherMember
  ? profileById.get(otherMember.user_id)
  : undefined;


      const last = messages?.find((m) => m.chat_id === chatId);
      const isMine = last?.sender_id === user.id;
    const myMember = myMemberByChat.get(chatId);

const isUnread =
  !!last &&
  last.sender_id !== user.id &&
  (!myMember?.last_read_at ||
    new Date(last.created_at) > new Date(myMember.last_read_at));

              return {
        chatId,
        name: profile?.name ?? "Unknown",
        avatarUrl: profile?.avatar_url ?? null,
        lastMessage: last
          ? isMine
            ? `You: ${last.content}`
            : last.content
          : "",
        time: last
          ? new Date(last.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
            isUnread,
      };
    });

    setChats(results);
    setLoading(false);
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF", "#FFC8E9"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back-outline"
          size={26}
          color="#000"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/profile");
            }
          }}
        />
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
          flexGrow: chats.length === 0 ? 1 : undefined,
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Connect with someone</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "./chatMessages/[chatId]",
                params: { chatId: item.chatId },
              })
            }
          >
            {/* AVATAR */}
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>

            <Text style={[styles.preview, item.isUnread && styles.unread]}>
              {item.lastMessage}
            </Text>
          </View>


            <Text style={[styles.time, item.isUnread && styles.unread]}>
  {item.time}
</Text>

          </TouchableOpacity>
        )}
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
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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
  avatarPlaceholder: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  time: {
    fontSize: 11,
    color: "#666",
    marginLeft: 8,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    opacity: 0.7,
    marginBottom: 15,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 130,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    opacity: 0.8,
  },
  unread: {
  fontWeight: "700",
  color: "#000",
},

});
