import { Request, Response } from "express";
import { CarroService } from "../service/CarroService";

// const carroService = new CarroService(AppDataSource.getRepository(Carro));

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
      const newCarro = await this.service.inserir({ marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor });
      res.status(201).json(newCarro);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro interno do servidor." });
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
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    try {
      const carro = await this.service.buscarPorId(id);
      if (!carro) {
        res.status(404).json({ error: "Carro não encontrado." });
        return;
      }
      res.status(200).json(carro);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor } = req.body;
    try {
      const carroAtualizado = await this.service.atualizar(id, { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor });
      if (!carroAtualizado) {
        res.status(404).json({ error: "Carro não encontrado para atualização." });
        return;
      }
      res.status(200).json(carroAtualizado);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    try {
      const carroDeletado = await this.service.deletar(id);
      if (!carroDeletado) {
        res.status(404).json({ error: "Carro não encontrado para exclusão." });
        return;
      }
      res.status(200).json({ message: "Carro deletado com sucesso.", carro: carroDeletado });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
  };
}