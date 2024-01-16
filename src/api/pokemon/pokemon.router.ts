import { Router } from "express";
import controller from "./pokemon.controller";

const router = Router();

router.get("/", controller.getAllPokemons);

export default router;