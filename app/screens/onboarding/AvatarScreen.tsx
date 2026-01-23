import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import * as FileSystem from "expo-file-system/legacy";



export default function AvatarScreen() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }




async function uploadAvatar(uri: string, userId: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  const byteArray = Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  );

  const filePath = `${userId}.jpg`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, byteArray, {
      upsert: true,
      contentType: "image/jpeg",
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

  async function saveAvatar() {
    if (!avatar || loading) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const avatarUrl = await uploadAvatar(avatar, user.id);

    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);


    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    await supabase.auth.refreshSession();
    
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a profile photo</Text>

      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={saveAvatar}
        disabled={!avatar || loading}
        style={{ marginTop: 24 }}
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
});
