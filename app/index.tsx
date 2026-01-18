import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const TYPE_COLORS: Record<string, string> = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A8A8",
};

const colorByType = (type: string) => TYPE_COLORS[type] ?? "#A8A8A8";

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const fetchingPokemons = async () => {
    const url = "https://pokeapi.co/api/v2/pokemon/?limit=20";
    try {
      const response = await fetch(url);
      const data = await response.json();

      const detailPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const data = await res.json();
          return {
            name: pokemon.name,
            image: data.sprites.front_default,
            imageBack: data.sprites.back_default,
            types: data.types,
          };
        }),
      );
      setPokemons(detailPokemons);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingPokemons();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {pokemons.map((item, i) => (
        <Link
          href={{ pathname: `/details`, params: { name: item.name } }}
          style={{
            backgroundColor: `${colorByType(item.types[0].type.name)}AA`,
            borderRadius: 20,
            padding: 16,
          }}
          key={i}
        >
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.types[0].type.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 150, height: 150 }}
              />
              <Image
                source={{ uri: item.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "gray",
  },
});
