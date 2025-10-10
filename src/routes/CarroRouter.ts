import { Router } from "express";
import { CarroController } from "./controller/CarroController";

export const carroRotas = (controller: CarroController): Router => {
  const router = Router();

  router.post("/carros", CarroController.inserir);
  router.get("/carros", CarroController.listar);
  router.get("/carros/:id", CarroController.buscarPorId);
  router.put("/carros/:id", CarroController.atualizar);
  router.delete("/carros/:id", CarroController.deletar);

return router;
};