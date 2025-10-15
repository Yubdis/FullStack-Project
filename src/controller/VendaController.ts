import { Request, Response } from "express";
import { VendaService } from "../service/VendaService";

export class VendaController {
  constructor(private service: VendaService) {}

  inserir = async (req: Request, res: Response) => {
    try {
      const venda = await this.service.inserir(req.body);
      res.status(201).json(venda);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  listar = async (_req: Request, res: Response) => {
    try {
      const vendas = await this.service.listar();
      res.status(200).json(vendas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  buscarPorId = async (req: Request, res: Response) => {
    try {
      const venda = await this.service.buscarPorId(Number(req.params.id));
      if (!venda) {
        res.status(404).json({ error: "Venda não encontrada." });
        return;
      }
      res.status(200).json(venda);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}