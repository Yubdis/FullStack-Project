import { Router } from 'express';
import { PedidoController } from '../controller/PedidoController';

export const pedidoRotas = (controller: PedidoController): Router => {
  const router = Router();

  router.post('/', controller.inserir);
  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);

  return router;
};