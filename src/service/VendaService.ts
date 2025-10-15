import { Repository } from "typeorm";
import { Venda } from "../entity/Venda";

export class VendaService {
  private repository: Repository<Venda>;

  constructor(repository: Repository<Venda>) {
    this.repository = repository;
  }

  async inserir(venda: Venda): Promise<Venda> {
    return await this.repository.save(venda);
  }

  async listar(): Promise<Venda[]> {
    return await this.repository.find({ relations: ["carro", "comprador", "vendedor"] });
  }

  async buscarPorId(id: number): Promise<Venda> {
    const venda = await this.repository.findOne({ where: { id }, relations: ["carro", "comprador", "vendedor"] });
    if (!venda) throw { code: 404, message: "Venda não encontrada" };
    return venda;
  }
}