import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text as RNText, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Checkbox, Text, TextInput } from "react-native-paper";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.background}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraHeight={20}
      >
        <Card style={styles.sheet} elevation={4}>
          <LinearGradient
            colors={["#FFFFFF", "#A4E4FF", "#FED1FD"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          >
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>
                Sign Up
              </Text>
              <Text style={styles.subtitle}>
                Create an account to get started
              </Text>

              <TextInput
                label="Name"
                mode="outlined"
                value={name}
                onChangeText={setName}
                style={styles.input}
                contentStyle={styles.inputContent}
                theme={{ roundness: 16 }}
              />

              <TextInput
                label="Email Address"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                contentStyle={styles.inputContent}
                theme={{ roundness: 16 }}
              />

              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                contentStyle={styles.inputContent}
                theme={{ roundness: 16 }}
              />

              <TextInput
                label="Confirm Password"
                mode="outlined"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirm ? "eye-off" : "eye"}
                    onPress={() => setShowConfirm(!showConfirm)}
                  />
                }
                style={styles.input}
                contentStyle={styles.inputContent}
                theme={{ roundness: 16 }}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={agreed ? "checked" : "unchecked"}
                  onPress={() => setAgreed(!agreed)}
                />
                <RNText style={styles.checkboxText}>
                  I've read and agree with the Terms and Privacy Policy.
                </RNText>
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  // TODO: Sign up logic (Supabase)
                }}
                style={styles.signUpButton}
                contentStyle={styles.buttonContent}
              >
                Sign Up
              </Button>

              <Text style={styles.footer}>
                Already a member?{" "}
                <Link href="/screens/LoginScreen">
                  <Text style={styles.link}>Login</Text>
                </Link>
              </Text>
            </Card.Content>
          </LinearGradient>
        </Card>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    justifyContent: "flex-end",
  },
  scrollContainer: {
    flexGrow: 1,
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
  title: {
    marginTop: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 14,
    color: "#555",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  inputContent: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  signUpButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footer: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  link: {
    color: "#6200ee",
    fontWeight: "bold",
  },
});
