// app/(tabs)/index.tsx
import React from "react";
import { StyleSheet } from "react-native";
// import OTPVerifyScreen from "../screens/OTPVerifyScreen";
import LoginScreen from "../screens/LoginScreen";
// import SignUpScreen from "../screens/SignUpScreen";
// import DashboardScreen from "../screens/DashboardScreen";

export default function DashboardTab() {
  // return <DashboardScreen />;
  return <LoginScreen />;
  // return <SignUpScreen />;
  // return <OTPVerifyScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the screen
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
    backgroundColor: "#fff", // optional, can remove for theme support
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
