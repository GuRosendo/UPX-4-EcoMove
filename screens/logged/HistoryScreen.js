import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, ScrollView, StyleSheet } from "react-native";
import { List, Text, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';

export default function HistoryScreen() {
  const [runs, setRuns] = useState([]);

  const { theme, themeColors } = useTheme();
  const colors = themeColors[theme];

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const loggedUser = await AsyncStorage.getItem("userData");
        if (!loggedUser) return;

        const user = JSON.parse(loggedUser);

        const stored = await AsyncStorage.getItem("runs");
        const list = stored ? JSON.parse(stored) : [];

        const userRuns = list.filter(r => r.userId === user.id);

        userRuns.sort((a, b) => b.timestamp - a.timestamp);

        setRuns(userRuns);
      };
      load();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>
        Histórico de Caminhadas
      </Text>

      {runs.length === 0 && (
        <Text style={[styles.empty, { color: colors.text }]}>Nenhuma caminhada registrada ainda.</Text>
      )}

      {runs.map((r) => (
        <Card key={r.runId} style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
          <Card.Title
            title={new Date(r.timestamp).toLocaleString()}
            subtitle={`Distância: ${((r.distance || 0) / 1000).toFixed(2)} km`}
            titleStyle={{ fontSize: 17, color: colors.text }}
            subtitleStyle={{ opacity: 0.7, color: colors.text }}
            left={() => (
              <View style={[styles.iconContainer, { backgroundColor: colors.mediumRedOpaque }]}>
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={20}
                  color={colors.mediumRed}
                />
              </View>
            )}
          />

          <Card.Content style={styles.content}>
            <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="clock" size={16} color={colors.mediumRed} /> Tempo: {r.duration || 0}s</Text>
            <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="fire" size={16} color={colors.mediumRed} /> Calorias: {(r.calories || 0).toFixed(1)} kcal</Text>
            <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="leaf" size={16} color={colors.mediumRed} /> CO₂: {r.co2Level || 0}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    opacity: 0.6,
  },
  card: {
    marginBottom: 14,
    borderRadius: 18,
    elevation: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 14,
  },
  content: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  text: {
    fontSize: 15,
  },
});
