import { Carro } from '../entity/Carro';

export class CarroRepository {
  private listaCarros: Carro[] = [];
  private proximoId: number = 1;

  inserir(carro: Omit<Carro, 'id'>): Carro {
    const novoCarro = {
      id: this.proximoId++,
      ...carro
    } as Carro;
    this.listaCarros.push(novoCarro);
    return novoCarro;
  }

  listar(): Carro[] {
    return [...this.listaCarros];
  }

  buscarPorId(id: number): Carro | undefined {
    return this.listaCarros.find(c => c.id === id);
  }

  atualizar(id: number, carro: Omit<Carro, 'id'>): Carro | undefined {
    const index = this.listaCarros.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const carroAtualizado = {
      id,
      ...carro
    } as Carro;
    this.listaCarros[index] = carroAtualizado;
    return carroAtualizado;
  }

  deletar(id: number): Carro | undefined {
    const index = this.listaCarros.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    return this.listaCarros.splice(index, 1).at(0);
  }
}