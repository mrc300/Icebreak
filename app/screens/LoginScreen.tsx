import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // lets you tap outside keyboard
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
                  Welcome!
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

                <TextInput
                  label="Password"
                  mode="outlined"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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

                <Text
                  style={styles.forgot}
                  onPress={() => {
                    // TODO: forgot password
                  }}
                >
                  Forgot Password?
                </Text>

                <Button
                  mode="contained"
                  onPress={() => {
                    // TODO: login logic (Supabase later)
                  }}
                  style={styles.loginButton}
                  contentStyle={styles.loginButtonContent}
                >
                  Login
                </Button>

                <Text style={styles.footer}>
                  Not a member?{" "}
                  <Link href="/screens/SignUpScreen" style={styles.link}>
                    Register now
                  </Link>
                </Text>
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
  title: {
    marginTop: 24,
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  inputContent: {
    height: 50,
  },
  forgot: {
    textAlign: "right",
    marginBottom: 24,
    color: "#6200ee",
  },
  loginButton: {
    marginBottom: 16,
  },
  loginButtonContent: {
    paddingVertical: 6,
  },
  footer: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  link: {
    color: "#6200ee",
    fontWeight: "bold",
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
});
