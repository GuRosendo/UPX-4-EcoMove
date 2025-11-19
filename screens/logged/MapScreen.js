import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, AppState } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext";

import { handleMessage } from "../../components/general/ToastMessage";

// Defina a task ANTES do componente
const LOCATION_TASK_NAME = "LOCATION_TRACKING";

const getDistance = (c1, c2) => {
  if (!c1 || !c2) return 0;
  
  const R = 6371e3;
  const lat1 = (c1.latitude * Math.PI) / 180;
  const lat2 = (c2.latitude * Math.PI) / 180;
  const dlat = lat2 - lat1;
  const dlon = ((c2.longitude - c1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const normalizeWeight = (w) => {
  if (!w) return 70;
  let clean = w.toString().replace(/\./g, "").replace(/,/g, "");
  const num = Number(clean);
  if (isNaN(num)) return 70;
  return num / 100;
};

// Defina a task globalmente - COM NOVA LÓGICA DO TIMER
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log("Erro na task:", error);
    return;
  }

  const { locations } = data;
  if (!locations || locations.length === 0) return;

  const loc = locations[0].coords;
  const currentTime = Date.now();

  try {
    const last = await AsyncStorage.getItem("lastCoord");
    const lastCoord = last ? JSON.parse(last) : null;

    const progressData = await AsyncStorage.getItem("currentRun");
    let progress = progressData
      ? JSON.parse(progressData)
      : {
          distance: 0,
          calories: 0,
          co2: 420,
          startTime: currentTime, // NOVO: armazena o tempo de início
          lastUpdateTime: currentTime, // NOVO: armazena último update
          duration: 0 // NOVO: armazena duração
        };

    const userData = await AsyncStorage.getItem("userData");
    const user = userData ? JSON.parse(userData) : null;
    let weight = user ? normalizeWeight(user.weight) : 70;

    if (lastCoord) {
      const dist = getDistance(lastCoord, loc);
      console.log("Distance calculated:", dist);
      
      progress.distance += dist;
      progress.calories = (progress.distance / 1000) * (weight * 0.78);
      progress.co2 = 400 + Math.floor(Math.random() * 30);
    }

    // NOVA LÓGICA: Atualizar duração baseada no tempo real
    if (progress.startTime) {
      progress.duration = Math.floor((currentTime - progress.startTime) / 1000);
    }

    progress.lastUpdateTime = currentTime;

    await AsyncStorage.setItem("lastCoord", JSON.stringify(loc));
    await AsyncStorage.setItem("currentRun", JSON.stringify(progress));

    console.log("Progress updated - Duration:", progress.duration, "Distance:", progress.distance);

  } catch (err) {
    console.log("Erro na task LOCATION_TRACKING:", err);
  }
});

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
  const appState = useRef(AppState.currentState);

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
        console.log("Progress update:", parsed);
        setDistance(parsed.distance || 0);
        setDuration(parsed.duration || 0); // ATUALIZADO: usa duration do progress
        setCalories(parsed.calories || 0);
        setCO2(parsed.co2 || 420);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitorar estado do app - ATUALIZADO para sincronizar dados
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App voltou ao foreground - atualizando dados");
        // Forçar atualização dos dados quando o app voltar
        const progress = await AsyncStorage.getItem("currentRun");
        if (progress) {
          const parsed = JSON.parse(progress);
          setDistance(parsed.distance || 0);
          setDuration(parsed.duration || 0);
          setCalories(parsed.calories || 0);
          setCO2(parsed.co2 || 420);
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const startTracking = async () => {
    try {
      // Solicitar permissões
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        handleMessage(false, "Aviso", "Permissão de localização em primeiro plano negada!", true);
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        handleMessage(false, "Aviso", "Permissão de localização em segundo plano negada!", true);
        return;
      }

      // Resetar dados
      setTracking(true);
      await AsyncStorage.removeItem("currentRun");
      await AsyncStorage.removeItem("lastCoord");

      // NOVO: Inicializar dados com timestamp
      const startTime = Date.now();
      const initialProgress = {
        distance: 0,
        calories: 0,
        co2: 420,
        startTime: startTime, // NOVO: armazena tempo de início
        lastUpdateTime: startTime, // NOVO: armazena último update
        duration: 0 // NOVO: inicia duração em 0
      };

      await AsyncStorage.setItem("currentRun", JSON.stringify(initialProgress));

      setDistance(0);
      setDuration(0);
      setCalories(0);
      setCO2(420);

      // REMOVIDO: o timer antigo não é mais necessário
      // timerRef.current = setInterval(() => {
      //   setDuration((d) => d + 1);
      // }, 1000);

      // Iniciar tracking de localização
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000, // Aumente para economizar bateria
        distanceInterval: 1, // Mínima distância para atualização
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "EcoMove",
          notificationBody: "Registrando sua caminhada...",
          notificationColor: "#FF0000",
        },
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.Fitness,
      });

      console.log("Location tracking started");

    } catch (error) {
      console.error("Erro ao iniciar tracking:", error);
      handleMessage(false, "Ocorreu um erro", "Erro ao iniciar tracking");
    }
  };

  const stopTracking = async () => {
    try {
      setTracking(false);

      // REMOVIDO: limpeza do timer antigo não é mais necessária
      // if (timerRef.current) {
      //   clearInterval(timerRef.current);
      //   timerRef.current = null;
      // }

      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await saveRun();

      await AsyncStorage.removeItem("currentRun");
      await AsyncStorage.removeItem("lastCoord");

      console.log("Location tracking stopped");

    } catch (error) {
      console.error("Erro ao parar tracking:", error);
    }
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
      
      handleMessage(true, "Sucesso", "Caminhada salva!");
    } catch (err) {
      console.error("Erro ao salvar caminhada:", err);
    }
  };

  // Verificar se a task está rodando
  useEffect(() => {
    const checkTask = async () => {
      const isRunning = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      console.log("Task running:", isRunning);
    };
    checkTask();
  }, []);

  // Função para formatar o tempo (OPCIONAL - mantém a formatação atual)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          {formatTime(duration)}
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