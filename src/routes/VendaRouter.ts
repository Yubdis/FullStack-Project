import { Router } from "express";
import { VendaController } from "../controller/VendaController";

export function vendaRotas(controller: VendaController) {
  const router = Router();
  router.post("/", controller.inserir);
  router.get("/", controller.listar);
  router.get("/:id", controller.buscarPorId);
  return router;
}