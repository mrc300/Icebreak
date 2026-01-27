import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { useEffect, useRef } from "react";

export function useUserLocation(radarEnabled: boolean | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const permissionGrantedRef = useRef<boolean>(false);

  const ensurePermission = async () => {
    if (permissionGrantedRef.current) return true;

    const { status } = await Location.getForegroundPermissionsAsync();
    console.log("Location permission:", status);
    if (status === "granted") {
      permissionGrantedRef.current = true;
      return true;
    }

    const request = await Location.requestForegroundPermissionsAsync();
    permissionGrantedRef.current = request.status === "granted";
    return permissionGrantedRef.current;
  };

  const updateLocation = async () => {
    try {
      const ok = await ensurePermission();
      if (!ok) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      console.log("Coords:", location.coords);

      await supabase.rpc("upsert_user_location", {
        p_user_id: user.id,
        p_lat: location.coords.latitude,
        p_lng: location.coords.longitude,
      });
    } catch (err) {
      console.error("Location update error:", err);
    }
  };

  useEffect(() => {
    if (!radarEnabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    updateLocation();

    intervalRef.current = setInterval(updateLocation, 5_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [radarEnabled]);
}
