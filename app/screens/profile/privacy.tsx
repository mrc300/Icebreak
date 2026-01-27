import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

export default function PrivacyScreen() {
  const [radarEnabled, setRadarEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

 
  useEffect(() => {
    const loadPrivacy = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("radar_enabled")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Load privacy error:", error);
      }

      setRadarEnabled(data?.radar_enabled ?? false);
      setLoading(false);
    };

    loadPrivacy();
  }, []);

  const toggleRadar = async (value: boolean) => {
    setRadarEnabled(value);
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ radar_enabled: value })
      .eq("id", user.id);

    if (error) {
      console.error("Update radar error:", error);
     
      setRadarEnabled(!value);
    }

    setSaving(false);
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
      locations={[0.43, 0.8, 1]}
      style={styles.container}
    >
  
      <View style={styles.topBar}>
        <Ionicons
          name="chevron-back-outline"
          size={26}
          color="#555"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Privacy</Text>
        <View style={{ width: 26 }} />
      </View>

  
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="radar" size={22} color="#555" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.cardTitle}>Radar Visibility</Text>
            <Text style={styles.cardSubtitle}>
              Allow nearby people to discover you
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Switch
            value={radarEnabled}
            onValueChange={toggleRadar}
            disabled={saving}
          />
        )}
      </View>

      <Text style={styles.infoText}>
        When radar is turned off, you won’t appear to nearby users and you won’t
        see people around you.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  infoText: {
    marginTop: 16,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});
