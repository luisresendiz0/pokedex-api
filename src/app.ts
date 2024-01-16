import express, { Express, json } from "express";
import morgan from "morgan";
import cors from "cors";
import 'dotenv/config'

// Routers imports
import pokemonsRouter from "./api/pokemon/pokemon.router";

const app: Express = express();

// App config
app.use(json());
app.use(cors());
app.use(morgan("dev"));

// App env vars
app.set("PORT", process.env.PORT || 4000);

// App routes
app.use("/pokemons", pokemonsRouter);

export default app;