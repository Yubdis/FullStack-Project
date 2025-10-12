import { Request, Response } from "express";
import { CarroService } from "../service/CarroService";

// const carroService = new CarroService(AppDataSource.getRepository(Carro));

export class CarroController {
  private service: CarroService;

  constructor(service: CarroService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor, categoria } = req.body;
    try{
        const newCarro = await this.service.inserir({ marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor, categoria });
        res.status(201).json(newCarro);
    }
    catch(err:any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const carros = await this.service.listar();
    res.json(carros);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{
        const carro = await this.service.buscarPorId(id);
        res.json(carro);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor, categoria } = req.body;

    try{
        const carroAtualizado = await this.service.atualizar(id, { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor, categoria });
        res.json(carroAtualizado);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{
        const produto = await this.service.deletar(id);
        res.json(produto);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };
}