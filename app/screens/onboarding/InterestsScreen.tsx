import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";

type Interest = {
  id: number;
  name: string;
};

export default function InterestsScreen() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    supabase
      .from("interests")
      .select("*")
      .then(({ data }) => {
        if (data) setInterests(data);
      });
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

const saveInterests = async () => {
  if (loading) return;

  if (selected.length === 0) {
    alert("Select at least one interest");
    return;
  }

  setLoading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const rows = selected.map((interestId) => ({
    user_id: user.id,
      interest_id: interestId,
    }));

    await supabase.from("user_interests").insert(rows);

    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

   
    await supabase.auth.refreshSession();

    setLoading(false);


  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Pick your interests
      </Text>

      {interests.map((interest) => (
        <View key={interest.id} style={styles.row}>
          <Checkbox
            status={selected.includes(interest.id) ? "checked" : "unchecked"}
            onPress={() => toggle(interest.id)}
          />
          <Text>{interest.name}</Text>
        </View>
      ))}

      <Button
        mode="contained"
        onPress={saveInterests}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 24 }}
      >
        Finish
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
