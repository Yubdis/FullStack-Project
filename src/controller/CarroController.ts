import { Request, Response } from "express";
import { CarroService } from "../service/CarroService";
import { AppDataSource } from "../data-source";
import { Carro } from "../entity/Carro";

const carroService = new CarroService(AppDataSource.getRepository(Carro));

export class CarroController {
  static async inserir(req: Request, res: Response) {
    try {
      const carro = await carroService.inserir(req.body);
      res.status(201).json(carro);
    } catch (err: any) {
      res.status(err.id || 500).json({ msg: err.msg || "Erro ao inserir carro" });
    }
  }

  static async listar(req: Request, res: Response) {
    const carros = await carroService.listar();
    res.json(carros);
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const carro = await carroService.buscarPorId(Number(req.params.id));
      res.json(carro);
    } catch (err: any) {
      res.status(err.id || 500).json({ msg: err.msg || "Carro não encontrado" });
    }
  }

  static async atualizar(req: Request, res: Response) {
    try {
      const carro = await carroService.atualizar(Number(req.params.id), req.body);
      res.json(carro);
    } catch (err: any) {
      res.status(err.id || 500).json({ msg: err.msg || "Erro ao atualizar carro" });
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const carro = await carroService.deletar(Number(req.params.id));
      res.json(carro);
    } catch (err: any) {
      res.status(err.id || 500).json({ msg: err.msg || "Erro ao deletar carro" });
    }
  }
}