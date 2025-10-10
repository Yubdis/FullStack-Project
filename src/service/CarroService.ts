import { Repository } from 'typeorm';
import { Carro } from '../entity/Carro';

export class CarroService {
  private repository: Repository<Carro>;

  constructor(repository: Repository<Carro>) {
    this.repository = repository;
  }

  async inserir(carro: Carro): Promise<Carro> {
    if(!carro.marca || !carro.modelo || !carro.ano || !carro.preco || !carro.quilometragem || !carro.cor || !carro.vendedor) {
        throw ({id: 400, msg: "Falta dados obrigatorios"});
    }
    return await this.repository.save(carro);
  }

  async listar(): Promise<Carro[]> {
    return await this.repository.find({ relations: ['vendedor'] });
  }

  async buscarPorId(id: number): Promise<Carro> {
    let carro = await this.repository.findOne({ where: { id }, relations: ['vendedor'] });
    if(!carro) {
        throw ({id: 404, msg: "Carro nao encontrado"});
    }
    return carro;
  }

  async atualizar(id: number, carro: Carro): Promise<Carro> {
    let carroAlt = await this.repository.findOneBy({id: id});
    if (!carroAlt) {
      throw ({id: 404, msg: "Carro nao encontrado"});
    }
    Object.assign(carroAlt, carro);
    return await this.repository.save(carroAlt);
  }

  async deletar(id: number): Promise<Carro> {
    let carroDeletado = await this.repository.findOneBy({id: id});
    if (!carroDeletado) {
        throw ({id: 404, msg: "Carro nao encontrado"});
    }
    await this.repository.remove(carroDeletado);
    return carroDeletado;
  }
}