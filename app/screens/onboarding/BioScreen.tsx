import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { router,  useLocalSearchParams } from "expo-router";

export default function BioScreen() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { name } = useLocalSearchParams<{ name: string }>();
  const saveBio = async () => {
    if (!bio.trim()) {
      alert("Please add a short bio");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not authenticated");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({       
        bio,        
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

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
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={saveBio}
        loading={loading}
        disabled={loading}
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
