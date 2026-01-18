import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text } from "react-native";

const details = () => {
  const { name } = useLocalSearchParams();

  const getDataById = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataById();
  }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text>details {name}</Text>
    </ScrollView>
  );
};

export default details;
