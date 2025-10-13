import { Request, Response } from "express";
import { PedidoService } from "../service/PedidoService";

export class PedidoController {
    private service: PedidoService;

    constructor(service: PedidoService) {
      this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
      const { cliente, listaProdutos } = req.body;
      try{
          const newProduct = await this.service.inserir({ cliente, listaProdutos });
          res.status(201).json(newProduct);
      }
      catch(err:any) {
          res.status(err.id).json({ error: err.msg });
      }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
      try {
        const pedidos = await this.service.listar();
        res.status(200).json(pedidos);
      } catch (err: any) {
        res.status(500).json({ error: err.message || "Erro interno do servidor." });
      }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }
      try {
        const pedido = await this.service.buscarPorId(id);
        if (!pedido) {
          res.status(404).json({ error: "Pedido não encontrado." });
          return;
        }
        res.status(200).json(pedido);
      } catch (err: any) {
        res.status(500).json({ error: err.message || "Erro interno do servidor." });
      }
    };
}