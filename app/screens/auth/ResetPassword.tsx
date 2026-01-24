import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function ResetPassword() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    // if (password.length < 6) {
    //   alert("Password must be at least 6 characters");
    //   return;
    // }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // 1. Update password with Supabase
      // 2. Auto login
      router.replace("/(tabs)/home");

      //   console.log("Password reset for:", email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#FFFFFF", "#A4E4FF", "#FED1FD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Reset Password
          </Text>

          <Text style={styles.subtitle}>Create a new password{"\n"}</Text>

          <TextInput
            label="New password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{ roundness: 16 }}
          />

          <TextInput
            label="Confirm password"
            mode="outlined"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{ roundness: 16 }}
          />

          <Button
            mode="contained"
            onPress={handleReset}
            loading={loading}
            disabled={loading}
            style={styles.primaryButton}
            contentStyle={styles.primaryButtonContent}
          >
            Reset & Login
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Back
          </Button>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 32,
  },
  email: {
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  inputContent: {
    height: 50,
  },
  primaryButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonContent: {
    paddingVertical: 6,
  },
  backButton: {
    alignSelf: "center",
  },
});
