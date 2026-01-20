import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";

const OTP_LENGTH = 4;

export default function OTPVerifyScreen() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputs = useRef<RNTextInput[]>([]);

  const email = "example@email.com"; // pass via params later

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["#FFFFFF", "#A4E4FF", "#FED1FD"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Enter confirmation code
            </Text>
            <Text style={styles.subtitle}>A 4-digit code was sent to</Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <RNTextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                autoFocus={index === 0}
                textAlign="center"
              />
            ))}
          </View>

          <Text
            style={styles.resend}
            onPress={() => {
              // TODO: resend OTP
            }}
          >
            Resend code
          </Text>

          <Button
            mode="contained"
            onPress={() => {
              // TODO: verify OTP
              router.push("/screens/dashboard/DashboardScreen");
            }}
            style={styles.continueButton}
            contentStyle={styles.buttonContent}
          >
            Continue
          </Button>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.25)",
    backgroundColor: "transparent",
    fontSize: 22,
    fontWeight: "600",
    color: "#222",
  },
  resend: {
    textAlign: "center",
    marginBottom: 24,
    color: "#6200ee",
    fontWeight: "600",
  },
  continueButton: {
    marginHorizontal: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
