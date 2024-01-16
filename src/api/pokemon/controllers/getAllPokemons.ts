import { Request, Response } from "express";
import splitArray from "../../../utlis/splitArray";
import getPokemonByURL from "../../../services/pokeapi/getPokemonByURL";
import { Pokemon } from "../../../types/api/Pokemon";
import getPokemonList from "../../../services/pokeapi/getPokemonList";
import PokemonItem from "../../../types/api/PokemonItem";

interface GetAllPokemonsQuery {
  limit?: number;
  page?: number;
  search?: string;
}

interface GetAllPokemonsBody {
  success: boolean;
  message: string;
  // data: Pokemon[] | null
  data: any
}

const getAllPokemons = async (req: Request<any, any, GetAllPokemonsQuery>, res: Response<GetAllPokemonsBody>) => {
  try {
    console.log(req.query);
    const list = await getPokemonList();
    let pokemons = list.results.sort((a, b) => a.name.localeCompare(b.name));

    if(req.query.search) {
      const search = req.query.search as string;

      if(search.trim().length === 0) {
        throw new Error("The search value is invalid");
      }

      pokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(search.toLowerCase()));
    };

    let pokemonPages: PokemonItem[][] = [[...pokemons]];
    console.log(pokemonPages);

    if(req.query.limit) {
      const limit = Number(req.query.limit);

      if(isNaN(limit) || limit < 1) {
        throw new Error("The limit is invalid");
      }
      
      // Validar cuando una busqueda es vacia
      if(pokemonPages[0].length > 0) {
        pokemonPages = splitArray(pokemons, limit);
      }
    }

    console.log(pokemonPages);

    let pokemonPage: PokemonItem[] = pokemonPages[0];

    if(req.query.page) {
      const page = Number(req.query.page);

      if(isNaN(page) || page < 1 || page > pokemonPages.length) {
        throw new Error("The page is invalid");
      }

      pokemonPage = pokemonPages[page - 1];
    }

    const pokemonPromises = pokemonPage.map(pokemon => getPokemonByURL(pokemon.url));
    const pokemonResults = await Promise.allSettled(pokemonPromises);
    const pokemonData: Pokemon[] = [];

    pokemonResults.forEach(result => {
      if(result.status === "fulfilled") {
        pokemonData.push(result.value);
      } else {
        throw new Error(result.reason);
      }
    });

    res.status(200).json({
      success: true,
      message: "OK",
      data: pokemonData
    });
  } catch (error) {
    const e = error as Error;
    console.error(e.message);

    res.status(400).json({
      success: false,
      message: e.message,
      data: null
    });
  }
};

export default getAllPokemons;