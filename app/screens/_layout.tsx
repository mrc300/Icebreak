import { supabase } from "@/lib/supabase";
import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ScreenLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );
  const segments = useSegments();

  // 1️⃣ Get initial session + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setOnboardingComplete(null);

        // 🔥 CRITICAL FIX: ensure profile exists
        if (event === "SIGNED_IN" && session?.user) {
          await supabase.from("profiles").upsert({
            id: session.user.id,
            name: session.user.user_metadata?.name ?? null,
            onboarding_completed: false,
          });
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2️⃣ Fetch onboarding state (SAFE: profile guaranteed to exist)
  useEffect(() => {
    if (!session) return;

    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log("PROFILE FETCH ERROR", error);
          setOnboardingComplete(false);
          return;
        }

        setOnboardingComplete(data?.onboarding_completed ?? false);
      });
  }, [session]);

  // 3️⃣ Routing logic (ONLY in effects)
  useEffect(() => {
    if (loading || onboardingComplete === null) return;

    const inAuth = segments[0] === "screens" && segments[1] === "auth";
    const inOnboarding =
      segments[0] === "screens" && segments[1] === "onboarding";

    // 🚫 Not logged in → auth
    if (!session && !inAuth) {
      router.replace("/screens/auth/LoginScreen");
      return;
    }

    // 🟡 Logged in but onboarding incomplete → onboarding
    if (session && onboardingComplete === false && !inOnboarding) {
      router.replace("/screens/onboarding/BioScreen");
      return;
    }

    // ✅ Logged in + onboarding done → tabs
    if (session && onboardingComplete === true && (inAuth || inOnboarding)) {
      router.replace("/(tabs)/discover");
    }
  }, [loading, session, onboardingComplete, segments]);

  // 4️⃣ Loading screen (prevents flicker & loops)
  if (loading || (session && onboardingComplete === null)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
