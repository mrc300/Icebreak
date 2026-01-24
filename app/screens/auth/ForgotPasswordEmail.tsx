import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function ForgotPasswordEmail() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // 1. Call Supabase OTP / password recovery API
      // 2. Navigate to OTP verification screen
      router.push({
        pathname: "/screens/auth/ForgotPasswordOTP",
        params: { email },
      });

      //   console.log("OTP requested for:", email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.sheet} elevation={4}>
            <LinearGradient
              colors={["#FFFFFF", "#A4E4FF", "#FED1FD"]}
              locations={[0.43, 0.8, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradient}
            >
              <Card.Content>
                <Text variant="headlineMedium" style={styles.title}>
                  Forgot Password
                </Text>

                <Text style={styles.subtitle}>
                  Enter your email address and we’ll send you a one-time code to
                  reset your password.
                </Text>

                <TextInput
                  label="Email address"
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  theme={{ roundness: 16 }}
                />

                <Button
                  mode="contained"
                  onPress={handleSendOtp}
                  loading={loading}
                  disabled={loading}
                  style={styles.primaryButton}
                  contentStyle={styles.primaryButtonContent}
                >
                  Send OTP
                </Button>

                <Button
                  mode="text"
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  Back to Login
                </Button>
              </Card.Content>
            </LinearGradient>
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  gradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  title: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#555",
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  inputContent: {
    height: 50,
  },
  primaryButton: {
    marginBottom: 12,
  },
  primaryButtonContent: {
    paddingVertical: 6,
  },
  backButton: {
    alignSelf: "center",
    marginBottom: 30,
  },
});
