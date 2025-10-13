import { Router } from "express";
import { UserController } from "../controller/UserController";

export const userRotas = (controller: UserController): Router => {
  const router = Router();

  router.post("/", controller.inserir);
  router.get("/", controller.listar);
  router.get("/:id", controller.buscarPorId);
  router.put("/:id", controller.atualizar);
  router.delete("/:id", controller.deletar);

return router;
};