import { Repository } from 'typeorm';
import { Produto } from '../entity/Produto';

export class ProdutoService {
  private repository: Repository<Produto>;

  constructor(repository: Repository<Produto>) {
    this.repository = repository;
  }

  async inserir(produto: Produto): Promise<Produto> {
    if(!produto.nome || !produto.categoria || !produto.preco) {
        throw ({id: 400, msg: "Falta dados obrigatorios"});    
    }
    return await this.repository.save(produto);
  }

  async listar(): Promise<Produto[]> {
    return await this.repository.find();
  }

  async buscarPorId(id: number): Promise<Produto> {
    let produto = await this.repository.findOneBy({id: id});
    if(!produto) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }
    return produto;
  }

  async atualizar(id: number, produto: Produto): Promise<Produto> {
    if(!produto.nome || !produto.categoria || !produto.preco) {
        throw ({id: 400, msg: "Falta dados obrigatorios"});    
    }
    let produtoAlt = await this.repository.findOneBy({id: id});
    console.log("produto ", produtoAlt)
    if (!produtoAlt || produtoAlt == null) {
      throw ({id: 404, msg: "Produto nao encontrado"});    
    }    
    else {
      produtoAlt.nome = produto.nome;
      produtoAlt.preco = produto.preco;
      produtoAlt.categoria = produto.categoria;
      return await this.repository.save(produtoAlt);
    }
  }

  async deletar(id: number): Promise<Produto> {
    let produtoDeletado = await this.repository.findOneBy({id: id});
    if (!produtoDeletado) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }    
    else {
      await this.repository.remove(produtoDeletado);
      return produtoDeletado;
    }
  }
}