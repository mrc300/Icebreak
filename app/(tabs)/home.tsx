import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import AvatarSphere from "../components/AvatarSphere";
import GradientHeader from "../components/GradientHeader";

export default function DiscoverScreen() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
      locations={[0.43, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <GradientHeader title="IceBreak" subtitle="Discover new connections" />
      <AvatarSphere />
    </LinearGradient>
  );
}
