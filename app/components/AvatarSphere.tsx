import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import Svg, { Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const SIZE = width;
const RADIUS = SIZE * 0.35;
const CENTER = SIZE / 2;

const AVATARS = Array.from({ length: 15 }).map((_, i) => ({
  id: i.toString(),
  name: `User ${i + 1}`,
  description: "Building IceBreak • CS @ UCPH",
  headsUp: Math.floor(Math.random() * 120) + 10,
  uri: `https://i.pravatar.cc/150?img=${i + 20}`,
}));

export default function AvatarSphere() {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [focused, setFocused] = useState<any>(null);

  const [sheetVisible, setSheetVisible] = useState(false);

  const velocity = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  // Bottom sheet animation
  const translateY = useRef(new Animated.Value(height)).current;

  const openSheet = () => {
    setSheetVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  };

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
      const opacity = 0.35 + depth * 0.65;

      return {
        ...item,
        x: x1,
        y: y2,
        z: z2,
        cx: CENTER + x1,
        cy: CENTER + y2,
        left: CENTER + x1 - 24,
        top: CENTER + y2 - 24,
        scale,
        opacity,
      };
    });
  }, [rotationX, rotationY]);

  const lines = useMemo(() => {
    const threshold = 150;
    const result: any[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].cx - nodes[j].cx;
        const dy = nodes[i].cy - nodes[j].cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          const avgDepth = (nodes[i].opacity + nodes[j].opacity) / 2;

          result.push({
            key: `${nodes[i].id}-${nodes[j].id}`,
            x1: nodes[i].cx,
            y1: nodes[i].cy,
            x2: nodes[j].cx,
            y2: nodes[j].cy,
            opacity: avgDepth * 0.5,
          });
        }
      }
    }

    return result;
  }, [nodes]);

  const handleAvatarPress = (n: any) => {
    raf.current && cancelAnimationFrame(raf.current);

    setRotationY((r) => r + Math.atan2(n.x, n.z));
    setRotationX((r) => r - Math.atan2(n.y, n.z));

    setFocused(n);
  };

  return (
    <>
      <View style={styles.container} {...panResponder.panHandlers}>
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
          {lines.map((l) => (
            <Line
              key={l.key}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth={1}
              opacity={l.opacity}
            />
          ))}
        </Svg>

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
        <TouchableOpacity activeOpacity={0.9} onPress={openSheet}>
          <Card style={styles.preview}>
            <Text style={styles.name}>{focused.name}</Text>
            <Text style={styles.subtitle}>Tap to view profile</Text>
          </Card>
        </TouchableOpacity>
      )}

      <Modal transparent visible={sheetVisible} animationType="fade">
        <Pressable style={styles.sheetBackdrop} onPress={closeSheet} />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <LinearGradient
            colors={["#FFFFFF", "#A4E4FF6E", "#FFC8E9B8"]}
            locations={[0.43, 0.8, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.sheetGradient}
          >
            <View style={styles.handle} />

            {focused && (
              <View style={styles.sheetContent}>
                <Avatar.Image
                  size={120}
                  source={{ uri: focused.uri }}
                  style={styles.bigAvatar}
                />

                <Text style={styles.sheetName}>{focused.name}</Text>
                <Text style={styles.sheetDesc}>{focused.description}</Text>

                <View style={styles.statsRow}>
                  <Card style={styles.statCard} elevation={2}>
                    <Card.Content style={styles.statContent}>
                      <MaterialCommunityIcons
                        name="hand-wave-outline"
                        size={24}
                        color="#6FBAFF"
                      />
                      <Text style={styles.statNumber}>Heads Up</Text>
                    </Card.Content>
                  </Card>

                  <Card
                    style={styles.statCard}
                    elevation={2}
                    onPress={() => {
                      closeSheet();
                    }}
                  >
                    <Card.Content style={styles.statContent}>
                      <FontAwesome name="comment" size={24} color="#6FBAFF" />
                      <Text style={styles.statNumber}>Chat</Text>
                    </Card.Content>
                  </Card>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </Modal>
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
    marginTop: 2,
  },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 999,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bigAvatar: {
    backgroundColor: "#6200ee",
    marginBottom: 12,
  },
  sheetName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sheetDesc: {
    marginTop: 6,
    color: "#666",
    textAlign: "center",
  },
  sheetGradient: {
    paddingBottom: 40,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 22,
  },
  statCard: {
    width: "35%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    marginTop: 4,
  },
  statLabel: {
    marginTop: 4,
    color: "#666",
  },
});
