// app/screens/LoginScreen.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Input } from "../../components/Input";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSendOTP = () => {
    // TODO: Call Supabase / backend to send OTP
    router.push(`/screens/OTPVerifyScreen?phone=${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        label="Mobile Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="numeric"
      />
      <Button title="Send OTP" onPress={handleSendOTP} />
      <Text
        style={styles.signup}
        onPress={() => router.push("/screens/SignUpScreen")}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  signup: { marginTop: 20, color: "blue", textAlign: "center" },
});
