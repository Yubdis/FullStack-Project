import { Request, Response } from "express";
import { UserService } from "../service/UserService";

// const UserService = new UserService(AppDataSource.getRepository(User));

export class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { nome,email } = req.body;
    try{
        const newUser = await this.service.inserir({ nome,email });
        res.status(201).json(newUser);
    }
    catch(err:any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.service.listar();
    res.json(users);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{
        const user = await this.service.buscarPorId(id);
        res.json(user);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { nome,email } = req.body;

    try{
        const userAtualizado = await this.service.atualizar(id, { nome,email });
        res.json(userAtualizado);
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