import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

const Details = () => {
  const { name } = useLocalSearchParams();
  const pokemonName = useMemo(() => {
    if (Array.isArray(name)) return name[0];
    return name ?? "";
  }, [name]);

  const [data, setData] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getDataById = useCallback(async () => {
    if (!pokemonName) {
      setLoading(false);
      setErrorMessage("Missing pokemon name.");
      return;
    }
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Could not load pokemon details.");
    } finally {
      setLoading(false);
    }
  }, [pokemonName]);
  useEffect(() => {
    getDataById();
  }, [getDataById]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pokemonName || "Details"}</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : data ? (
        <View style={{ gap: 16 }}>
          <View style={styles.imagesRow}>
            {data.sprites.front_default ? (
              <Image
                source={{ uri: data.sprites.front_default }}
                style={styles.image}
              />
            ) : null}
            {data.sprites.back_default ? (
              <Image
                source={{ uri: data.sprites.back_default }}
                style={styles.image}
              />
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Types</Text>
            <View style={styles.chipsRow}>
              {data.types.map((t) => (
                <View style={styles.chip} key={t.type.name}>
                  <Text style={styles.chipText}>{t.type.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={{ gap: 8 }}>
              {data.stats.map((s) => (
                <View style={styles.statRow} key={s.stat.name}>
                  <Text style={styles.statLabel}>{s.stat.name}</Text>
                  <View style={styles.statBarTrack}>
                    <View
                      style={[
                        styles.statBarFill,
                        { width: `${Math.min(s.base_stat, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.statValue}>{s.base_stat}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Info</Text>
            <Text style={styles.infoText}>ID: {data.id}</Text>
            <Text style={styles.infoText}>Height: {data.height}</Text>
            <Text style={styles.infoText}>Weight: {data.weight}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  error: {
    color: "#b91c1c",
    fontSize: 16,
    textAlign: "center",
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  image: {
    width: 160,
    height: 160,
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    width: 90,
    textTransform: "capitalize",
  },
  statBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  statValue: {
    width: 40,
    textAlign: "right",
  },
  infoText: {
    fontSize: 15,
  },
});
