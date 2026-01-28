  import { LinearGradient } from "expo-linear-gradient";
  import { router, useLocalSearchParams } from "expo-router";
  import React, { useRef, useState } from "react";


  import {
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    StyleSheet,
    View,
  } from "react-native";
  import { Button, Text } from "react-native-paper";
  import { supabase } from "@/lib/supabase";


  const OTP_LENGTH = 6;

  export default function ForgotPasswordOTP() {
    const { email } = useLocalSearchParams<{ email: string }>();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);

    const inputs = useRef<RNTextInput[]>([]);

    const handleChange = (text: string, index: number) => {
      if (!/^\d*$/.test(text)) return;

      const next = [...otp];
      next[index] = text.slice(-1);
      setOtp(next);

      if (text && index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }
    };

    const handleBackspace = (index: number) => {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    };

      const handleVerify = async () => {
        const token = otp.join("");

        if (token.length !== OTP_LENGTH) {
          alert("Please enter the complete OTP");
          return;
        }

        try {
          setLoading(true);

          const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "recovery",
          });

          if (error) {
            alert(error.message);
            return;
          }

          router.replace("/screens/auth/ResetPassword");
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
              Verify Code
            </Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{"\n"}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.otpRow}>
              {otp.map((value, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputs.current[index] = ref;
                  }}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    nativeEvent.key === "Backspace" && handleBackspace(index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpBox}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleVerify}
              loading={loading}
              disabled={loading}
              style={styles.verifyButton}
              contentStyle={styles.verifyButtonContent}
            >
              Verify & Continue
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
    otpRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 32,
    },
    otpBox: {
      width: 48,
      height: 56,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      fontSize: 20,
      elevation: 2,
    },
    verifyButton: {
      marginBottom: 12,
    },
    verifyButtonContent: {
      paddingVertical: 6,
    },
    backButton: {
      alignSelf: "center",
    },
  });
