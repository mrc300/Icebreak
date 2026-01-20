import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Divider, Text } from "react-native-paper";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const user = {
    name: "Abhirukth",
    email: "abhirukth@email.com",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#A4E4FF", "#FED1FD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        <Avatar.Text
          size={72}
          label={user.name.charAt(0)}
          style={styles.avatar}
        />
        <Text variant="titleLarge" style={styles.name}>
          {user.name}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <ProfileItem title="Edit Profile" />
        <ProfileItem title="Account Settings" />
        <ProfileItem title="Privacy & Security" />
        <ProfileItem title="Help & Support" />

        <Divider style={styles.divider} />

        <Button
          style={styles.button}
          mode="outlined"
          onPress={() => {
            // TODO: Supabase logout
            router.replace("/screens/chat/MessagesScreen");
          }}
        >
          Chats
        </Button>

        <Button
              mode="outlined"
              textColor="#D32F2F"
              onPress={async () => {
                await supabase.auth.signOut();
                router.replace("/screens/auth/LoginScreen");
              }}
            >
              Logout
            </Button>

      </View>
    </View>
  );
}

function ProfileItem({ title }: { title: string }) {
  return (
    <View style={styles.item}>
      <Text variant="bodyLarge">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },

  avatar: {
    backgroundColor: "#6200ee",
    marginBottom: 12,
  },

  name: {
    fontWeight: "bold",
  },

  email: {
    marginTop: 4,
    color: "#555",
  },

  content: {
    padding: 20,
  },

  item: {
    paddingVertical: 16,
  },

  divider: {
    marginVertical: 16,
  },

  button: {
    marginBottom: 16,
  },
});
