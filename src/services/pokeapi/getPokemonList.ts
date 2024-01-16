import PokemonItem from "../../types/api/PokemonItem";

interface PokemonData {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonItem[]
};

const getPokemonList = async () => {
  const baseURL = process.env.SERVICE_POKEAPI_URL;
  const url = `${baseURL}/pokemon?limit=1500`;
  const response = await fetch(url);
  const data = await response.json() as PokemonData;
  return data;
}

export default getPokemonList;