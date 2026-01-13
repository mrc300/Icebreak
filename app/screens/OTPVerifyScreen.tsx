// app/screens/OTPVerifyScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Input } from "../../components/Input";

export default function OTPVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerifyOTP = () => {
    // TODO: Call Supabase / backend to verify OTP
    // TODO: Save session so user stays logged in

    // Navigate to MainTabs (Dashboard)
    router.replace("/screens/MainTabs");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Input
        label={`OTP sent to ${phone}`}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
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
});
