import { Request, Response } from "express";
import { CarroService } from "../service/CarroService";

export class CarroController {
  private service: CarroService;

  constructor(service: CarroService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor } = req.body;
    if (!marca || !modelo || !ano || !preco || !quilometragem || !cor || !vendedor) {
      res.status(400).json({ error: "Campos obrigatórios faltando." });
      return;
    }
    try {
      const imagem = req.file ? `/uploads/${req.file.filename}` : (req.body.imagem || undefined);
      const novo: Partial<any> = { marca, modelo, ano: Number(ano), preco: Number(preco), quilometragem: Number(quilometragem), cor, descricao, vendedor, imagem };
      const newCarro = await this.service.inserir(novo);
      res.status(201).json(newCarro);
    } catch (err: any) {
      const status = err?.code || 500;
      res.status(status).json({ error: err?.message || "Erro interno do servidor." });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const carros = await this.service.listar();
      res.status(200).json(carros);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ID inválido." }); return; }
    try {
      const carro = await this.service.buscarPorId(id);
      res.status(200).json(carro);
    } catch (err: any) {
      const status = err?.code || 500;
      res.status(status).json({ error: err?.message || "Erro interno do servidor." });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ID inválido." }); return; }
    try {
      const updates: any = { ...req.body };
      if (req.file) updates.imagem = `/uploads/${req.file.filename}`;
      const carroAtualizado = await this.service.atualizar(id, updates);
      res.status(200).json(carroAtualizado);
    } catch (err: any) {
      const status = err?.code || 500;
      res.status(status).json({ error: err?.message || "Erro interno do servidor." });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ID inválido." }); return; }
    try {
      const carroDeletado = await this.service.deletar(id);
      res.status(200).json({ message: "Carro deletado com sucesso.", carro: carroDeletado });
    } catch (err: any) {
      const status = err?.code || 500;
      res.status(status).json({ error: err?.message || "Erro interno do servidor." });
    }
  };
}