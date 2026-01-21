import { supabase } from "@/lib/supabase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import GradientHeader from "../components/GradientHeader";

type Profile = {
  name: string;
  bio: string;
  avatar_url: string | null;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [chatCount, setChatCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // 🔹 Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, bio, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // 🔹 Interests
        const { data: interestsData } = await supabase
          .from("user_interests")
          .select("interests(name)")
          .eq("user_id", user.id);

        setInterests(
          interestsData?.map((i: any) => i.interests.name) ?? [],
        );

        const { data, error } = await supabase
          .from("chat_members")
          .select("chat_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Chat count error:", error);
        } else {
          const uniqueChats = new Set(data.map((d: any) => d.chat_id));
          setChatCount(uniqueChats.size);
        }

      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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

          {profile && (
            <View style={styles.centerSection}>
              {profile.avatar_url ? (
                <Avatar.Image
                  size={150}
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={150}
                  label={profile.name?.charAt(0) ?? "?"}
                  style={styles.avatar}
                />
              )}

              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.description}>{profile.bio}</Text>

              {/* Interests */}
              {interests.length > 0 ? (
                <View style={styles.interests}>
                  {interests.map((i) => (
                    <Text key={i} style={styles.interestChip}>
                      {i}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.noInterests}>
                  No interests added yet
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Chats stat */}
        <View style={styles.statsRow}>
          <Card
            style={styles.statCard}
            elevation={2}
            onPress={() => router.push("/screens/chat/MessagesScreen")}
          >
            <Card.Content style={styles.statContent}>
              <FontAwesome name="comment" size={24} color="#6FBAFF" />
              <Text style={styles.statNumber}>{chatCount}</Text>
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
    position: "relative",
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

  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },

  interestChip: {
    backgroundColor: "#E9D5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
  },

  noInterests: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  statCard: {
    width: "40%",
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
    marginTop: 4,
  },

  statLabel: {
    color: "#666",
    marginTop: 2,
  },
});
