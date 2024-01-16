import { Pokemon } from "../../types/api/Pokemon";

const getPokemonByURL = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json() as Pokemon;
  return data;
};

export default getPokemonByURL;