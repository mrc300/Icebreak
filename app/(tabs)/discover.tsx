import { supabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Avatar, Chip, Divider, Text } from "react-native-paper";
import GradientHeader from "../components/GradientHeader";

type DiscoverUser = {
  id: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  distance_m: number;
  updated_at: string;
  interests: string[];

  commonInterests: string[];
  otherInterests: string[];
};

export default function DiscoverScreen() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [myInterests, setMyInterests] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      await loadMyInterests();
      await fetchDiscoverFeed();
    };

    init();
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadMyInterests();
  //     fetchDiscoverFeed();
  //   }, 5000); // refresh every 5 seconds

  //   return () => clearInterval(interval);
  // }, []);

  const loadMyInterests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_interests")
      .select("interests(name)")
      .eq("user_id", user.id);

    setMyInterests(data?.map((i: any) => i.interests.name) ?? []);
  };

  const fetchDiscoverFeed = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUsers([]);
        return;
      }

      //temp cordinates for testing we have use gps later
      const lat = 55.6761;
      const lng = 12.5683;

      const { data: nearby, error: nearbyError } = await supabase.rpc(
        "nearby_users",
        {
          lat,
          lng,
          radius_m: 100,
        },
      );

      if (nearbyError) throw nearbyError;

      if (!nearby || nearby.length === 0) {
        setUsers([]);
        return;
      }

      const userIds = nearby
        .map((r: any) => r.user_id)
        .filter((id: string) => id !== user.id);

      if (userIds.length === 0) {
        setUsers([]);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          bio,
          avatar_url,
          radar_enabled,
          user_interests (
            interests ( name )
          )
        `,
        )
        .in("id", userIds)
        .eq("radar_enabled", true);

      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) {
        setUsers([]);
        return;
      }
      console.log("RPC nearby:", nearby.length);
      console.log("After self-filter:", userIds.length);
      console.log("Profiles returned:", profiles.length);

      const formatted: DiscoverUser[] = profiles.map((p: any) => {
        const distance = nearby.find(
          (n: any) => n.user_id === p.id,
        )?.distance_m;

        const allInterests = p.user_interests.map(
          (ui: any) => ui.interests.name,
        );

        const common = allInterests.filter((i: string) =>
          myInterests.includes(i),
        );

        const others = allInterests.filter(
          (i: string) => !myInterests.includes(i),
        );

        return {
          id: p.id,
          name: p.name ?? "Unknown",
          bio: p.bio ?? "Down to meet new people.",
          avatar_url: p.avatar_url,
          distance_m: Math.round(distance ?? 0),
          updated_at: "5 min ago",
          interests: allInterests,
          commonInterests: common,
          otherInterests: others,
        };
      });

      formatted.sort((a, b) => {
        if (a.distance_m !== b.distance_m) {
          return a.distance_m - b.distance_m;
        }

        return b.commonInterests.length - a.commonInterests.length;
      });

      setUsers(formatted);
    } catch (err) {
      console.error("Discover feed error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
      locations={[0.43, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <GradientHeader title="IceBreak" subtitle="Your local feed" />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchDiscoverFeed}
        contentContainerStyle={[
          styles.list,
          users.length === 0 && !loading && { flex: 1 },
        ]}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No one nearby right now</Text>
              <Text style={styles.emptySubtitle}>
                IceBreak shows people within 100 meters. Move around or check
                again later 👀
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cardShadow}>
            <LinearGradient
              colors={["#FFFFFF", "#F4F4F4"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.card}
            >
              <View style={styles.header}>
                <Avatar.Image
                  size={42}
                  source={{
                    uri: item.avatar_url ?? "https://i.pravatar.cc/150?img=12",
                  }}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color="#6eb5eb" />
                    <Text style={styles.time}>{item.distance_m} m away</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text>{item.bio}</Text>
              </View>

              <Divider />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>

                {item.interests.length === 0 ? (
                  <Text style={styles.noInterests}>No interests found</Text>
                ) : (
                  <View style={styles.chips}>
                    {/* Common interests (blue) */}
                    {item.commonInterests.map((i) => (
                      <Chip key={`common-${i}`} style={styles.chip}>
                        {i}
                      </Chip>
                    ))}

                    {/* Other interests (purple) */}
                    {item.otherInterests.map((i) => (
                      <Chip key={`other-${i}`} style={styles.otherChip}>
                        {i}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 120,
  },

  cardShadow: {
    marginBottom: 16,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    // Android shadow
    elevation: 10,
  },

  card: {
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    marginTop: 10,
    marginLeft: 12,
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  time: {
    marginLeft: 6,
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    padding: 14,
    marginLeft: 9,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: "#6eb5eb",
    borderRadius: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  otherChip: {
    backgroundColor: "#E9D5FF", // purple (color B)
    borderRadius: 16,
  },

  noInterests: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },
});
