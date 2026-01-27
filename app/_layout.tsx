import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useUserLocation } from "./hooks/useUserLocation";

export default function RootLayout() {
  const [radarEnabled, setRadarEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadRadar = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("radar_enabled")
        .eq("id", userId)
        .single();

      if (!error && mounted) {
        setRadarEnabled(data?.radar_enabled ?? false);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadRadar(data.session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadRadar(session.user.id);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useUserLocation(radarEnabled === true);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
