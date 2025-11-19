import { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext";

export default function MapScreen() {
  const { theme, themeColors } = useTheme();
  const colors = themeColors[theme];

  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [co2, setCO2] = useState(420);
  const [user, setUser] = useState(null);

  const timerRef = useRef(null);

  const normalizeWeight = (w) => {
    if (!w) return 70;

    let clean = w.toString().replace(/\./g, "").replace(/,/g, "");
    const num = Number(clean);

    if (isNaN(num)) return 70;

    return num / 100;
  };

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const u = JSON.parse(data);
        u.weight = normalizeWeight(u.weight);
        setUser(u);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const progress = await AsyncStorage.getItem("currentRun");
      if (progress) {
        const parsed = JSON.parse(progress);
        setDistance(parsed.distance || 0);
        setCalories(parsed.calories || 0);
        setCO2(parsed.co2 || 420);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTracking = async () => {
    const fg = await Location.requestForegroundPermissionsAsync();
    if (!fg.granted) return;

    const bg = await Location.requestBackgroundPermissionsAsync();
    if (!bg.granted) return;

    setTracking(true);

    await AsyncStorage.removeItem("currentRun");
    await AsyncStorage.removeItem("lastCoord");

    setDistance(0);
    setDuration(0);
    setCalories(0);
    setCO2(420);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    await Location.startLocationUpdatesAsync("LOCATION_TRACKING", {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "EcoMove",
        notificationBody: "Registrando sua caminhada...",
      },
    });
  };

  const stopTracking = async () => {
    setTracking(false);

    if (timerRef.current) clearInterval(timerRef.current);

    await Location.stopLocationUpdatesAsync("LOCATION_TRACKING");

    await saveRun();

    await AsyncStorage.removeItem("currentRun");
    await AsyncStorage.removeItem("lastCoord");
  };

  const saveRun = async () => {
    try {
      const loggedUser = await AsyncStorage.getItem("userData");
      if (!loggedUser) return;

      const u = JSON.parse(loggedUser);

      const stored = await AsyncStorage.getItem("runs");
      const list = stored ? JSON.parse(stored) : [];

      const record = {
        runId: Date.now(),
        userId: u.id,
        timestamp: Date.now(),
        distance,
        duration,
        calories,
        co2Level: co2,
      };

      list.push(record);
      await AsyncStorage.setItem("runs", JSON.stringify(list));
    } catch (err) {
      console.error("Erro ao salvar corrida:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: colors.text }]}
      >
        Registrar Caminhada
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.item, { color: colors.text }]}>
          <FontAwesome6 name="ruler" size={20} color={colors.mediumRed} />{" "}
          Distância: {(distance / 1000).toFixed(2)} km
        </Text>

        <Text style={[styles.item, { color: colors.text }]}>
          <FontAwesome6 name="clock" size={20} color={colors.mediumRed} /> Tempo:{" "}
          {duration}s
        </Text>

        <Text style={[styles.item, { color: colors.text }]}>
          <FontAwesome6 name="fire" size={20} color={colors.mediumRed} />{" "}
          Calorias: {calories.toFixed(1)} kcal
        </Text>

        <Text style={[styles.item, { color: colors.text }]}>
          <FontAwesome6 name="leaf" size={20} color={colors.mediumRed} /> CO₂:{" "}
          {co2}
        </Text>

        {!tracking ? (
          <Button
            mode="contained"
            onPress={startTracking}
            style={[styles.btn, { backgroundColor: colors.mediumRed }]}
          >
            Iniciar Caminhada
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={stopTracking}
            style={[styles.btn, styles.stopBtn, { backgroundColor: colors.darkRed }]}
          >
            Encerrar Caminhada
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25 },
  title: { textAlign: "center", marginBottom: 25 },
  card: {
    padding: 25,
    borderRadius: 20,
    elevation: 6,
    gap: 15,
  },
  item: { fontSize: 17 },
  btn: { marginTop: 10, padding: 6, borderRadius: 12 },
});
