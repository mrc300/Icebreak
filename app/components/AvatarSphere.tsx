import React, { useMemo, useRef, useState } from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View } from "react-native";
import { Avatar, Card } from "react-native-paper";

const { width } = Dimensions.get("window");
const SIZE = width;
const RADIUS = SIZE * 0.35;
const CENTER = SIZE / 2;

const AVATARS = Array.from({ length: 15 }).map((_, i) => ({
  id: i.toString(),
  name: `User ${i + 1}`,
  subtitle: "IceBreak user",
  uri: `https://i.pravatar.cc/150?img=${i + 20}`,
}));

export default function AvatarSphere() {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [focused, setFocused] = useState<any>(null);

  const velocity = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const applyMomentum = () => {
    velocity.current.x *= 0.94;
    velocity.current.y *= 0.94;

    setRotationY((r) => r + velocity.current.x);
    setRotationX((r) => r + velocity.current.y);

    if (
      Math.abs(velocity.current.x) > 0.0001 ||
      Math.abs(velocity.current.y) > 0.0001
    ) {
      raf.current = requestAnimationFrame(applyMomentum);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (_, g) => {
      lastTouch.current = { x: g.moveX, y: g.moveY };
      raf.current && cancelAnimationFrame(raf.current);
    },

    onPanResponderMove: (_, g) => {
      const dx = g.moveX - lastTouch.current.x;
      const dy = g.moveY - lastTouch.current.y;

      lastTouch.current = { x: g.moveX, y: g.moveY };

      velocity.current = {
        x: -dx * 0.001,
        y: -dy * 0.001,
      };

      setRotationY((r) => r - dx * 0.002);
      setRotationX((r) => r - dy * 0.002);
    },

    onPanResponderRelease: () => {
      raf.current = requestAnimationFrame(applyMomentum);
    },
  });

  const nodes = useMemo(() => {
    return AVATARS.map((item, i) => {
      const theta = Math.acos(1 - (2 * (i + 1)) / AVATARS.length);
      const phi = Math.sqrt(AVATARS.length * Math.PI) * theta;

      let x = RADIUS * Math.sin(theta) * Math.cos(phi);
      let y = RADIUS * Math.cos(theta);
      let z = RADIUS * Math.sin(theta) * Math.sin(phi);

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const depth = (z2 + RADIUS) / (2 * RADIUS);
      const scale = 0.6 + depth * 0.6;
      const opacity = 0.4 + depth * 0.6;

      return {
        ...item,
        x: x1,
        y: y2,
        z: z2,
        left: CENTER + x1 - 24,
        top: CENTER + y2 - 24,
        scale,
        opacity,
      };
    });
  }, [rotationX, rotationY]);

  const handleAvatarPress = (n: any) => {
    raf.current && cancelAnimationFrame(raf.current);

    setRotationY((r) => r + Math.atan2(n.x, n.z));
    setRotationX((r) => r - Math.atan2(n.y, n.z));

    setFocused(n);
  };

  return (
    <>
      <View style={styles.container} {...panResponder.panHandlers}>
        {nodes
          .sort((a, b) => a.z - b.z)
          .map((n) => (
            <View
              key={n.id}
              style={[
                styles.avatar,
                {
                  left: n.left,
                  top: n.top,
                  transform: [{ scale: n.scale }],
                  opacity: n.opacity,
                  zIndex: Math.floor(n.z),
                },
              ]}
            >
              <Avatar.Image
                size={48}
                source={{ uri: n.uri }}
                onTouchEnd={() => handleAvatarPress(n)}
                style={focused?.id === n.id && styles.focusedAvatar}
              />
            </View>
          ))}
      </View>

      {focused && (
        <Card style={styles.preview}>
          <Text style={styles.name}>{focused.name}</Text>
          <Text style={styles.subtitle}>{focused.subtitle}</Text>
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignSelf: "center",
  },
  avatar: {
    position: "absolute",
  },
  focusedAvatar: {
    elevation: 6,
  },
  preview: {
    alignSelf: "center",
    marginTop: -20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
