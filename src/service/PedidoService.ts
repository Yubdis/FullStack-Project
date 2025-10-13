import { Repository } from 'typeorm';
import { Pedido } from '../entity/Pedido';

export class PedidoService {
  private repository: Repository<Pedido>;

  constructor(repository: Repository<Pedido>) {
    this.repository = repository;
  }

  async inserir(pedido: Pedido): Promise<Pedido> {
    if(!pedido.cliente || !pedido.listaProdutos || pedido.listaProdutos.length <=0 ) {
        throw ({id: 400, msg: "Falta dados obrigatorios"});
    }
    pedido.dataHora = new Date();
    return await this.repository.save(pedido);
  }

  async listar(): Promise<Pedido[]> {
    return await this.repository.find({
        relations: {
            cliente: true
        }
    });
  }

  async buscarPorId(id: string): Promise<Pedido> {
    let produto = await this.repository.findOne({
        relations: {
            cliente: true,
            listaProdutos: true
        },
        where: {
            id: id
        }
    });
    if(!produto) {
        throw ({id: 404, msg: "Produto nao encontrado"});
    }
    return produto;
  }

}