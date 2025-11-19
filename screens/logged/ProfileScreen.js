import { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import { useTheme } from '../../components/ThemeContext';
import { FontAwesome6 } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  const { theme, themeColors } = useTheme();
  const colors = themeColors[theme];

  useEffect(() => {
    AsyncStorage.getItem("userData").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    let year = date.getFullYear();
    if (year < 1000) {
      const parts = dateString.split(" ")[0].split("-");
      year = parts[0].padStart(4, "0");
      const month = parts[1];
      const day = parts[2];
      return `${day}/${month}/${year}`;
    }

    return date.toLocaleDateString("pt-BR");
  };

  const formatWeight = (weight) => {
    if (!weight) return "";

    let clean = weight.toString().replace(/\./g, "").replace(/,/g, "");

    const numeric = Number(clean);

    const kg = (numeric / 100).toFixed(2);

    return kg.replace(".", ",");
  };

  if (!user)
    return <Text style={[styles.loading, { color: colors.text }]}>Carregando perfil...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require("../../assets/images/WalkingWoman.png")}
        style={styles.avatar}
        resizeMode="contain"
      />

      <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>
        {user.fullName}
      </Text>

      <View style={[styles.box, { backgroundColor: colors.card }]}>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="envelope" size={16} color={colors.mediumRed} /> Email: {user.email}</Text>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="phone" size={16} color={colors.mediumRed} /> Telefone: {user.phone}</Text>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="cake-candles" size={16} color={colors.mediumRed} /> Nascimento: {formatDate(user.birthDate)}</Text>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="venus-mars" size={16} color={colors.mediumRed} /> Sexo: {user.gender}</Text>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="weight-scale" size={16} color={colors.mediumRed} /> Peso: {formatWeight(user.weight)} kg</Text>
        <Text style={[styles.text, { color: colors.text }]}><FontAwesome6 name="ruler" size={16} color={colors.mediumRed} /> Altura: {user.height} cm</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flex: 1
  },
  loading: {
    padding: 20,
    textAlign: 'center',
    flex: 1
  },
  avatar: {
    width: 180,
    height: 180,
    marginBottom: 15
  },
  title: {
    marginBottom: 25,
    textAlign: 'center'
  },
  box: {
    width: "100%",
    padding: 18,
    borderRadius: 16,
    elevation: 4,
    gap: 12
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
  }
});
