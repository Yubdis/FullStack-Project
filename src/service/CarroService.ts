import { FindManyOptions, Repository } from 'typeorm';
import { Carro } from '../entity/Carro';

export class CarroService {
  private repository: Repository<Carro>;

  constructor(repository: Repository<Carro>) {
    this.repository = repository;
  }

  async inserir(carro: Partial<Carro>): Promise<Carro> {
    if (!carro.marca || !carro.modelo || !carro.ano || !carro.preco || !carro.quilometragem || !carro.cor || !carro.vendedor) {
      throw { code: 400, message: "Falta dados obrigatorios" };
    }
    return await this.repository.save(this.repository.create(carro));
  }

  async listar(marca?: string): Promise<Carro[]> {
    const options: FindManyOptions<Carro> = {
       relations: ['vendedor'],
     };

    if (marca) {
      options.where = { marca };
    }

    return await this.repository.find(options);
  }

  async buscarPorId(id: number): Promise<Carro> {
    const carro = await this.repository.findOne({ where: { id }, relations: ['vendedor'] });
    if (!carro) throw { code: 404, message: "Carro nao encontrado" };
    return carro;
  }

  async atualizar(id: number, carro: Partial<Carro>): Promise<Carro> {
    const carroAlt = await this.repository.findOneBy({ id });
    if (!carroAlt) throw { code: 404, message: "Carro nao encontrado" };
    Object.assign(carroAlt, carro);
    return await this.repository.save(carroAlt);
  }

  async deletar(id: number): Promise<Carro> {
    const carroDeletado = await this.repository.findOneBy({ id });
    if (!carroDeletado) throw { code: 404, message: "Carro nao encontrado" };
    await this.repository.remove(carroDeletado);
    return carroDeletado;
  }
}