import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { router,  useLocalSearchParams } from "expo-router";

export default function BioScreen() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const saveBio = async () => {
    if (!bio.trim()) {
      alert("Please add a short bio");
      return;
    }

    if (loading) return;
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      setLoading(false);
      alert("Not authenticated");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        bio: bio.trim(),
      })
      .eq("id", user.id);

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    setLoading(false);
    router.push("/screens/onboarding/InterestsScreen");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Tell us about yourself
      </Text>

      <TextInput
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        maxLength={200}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={saveBio}
        loading={loading}
        disabled={loading || !bio.trim()}
      >
        Continue
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 24,
  },
});
