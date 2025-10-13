import { Repository } from 'typeorm';
import { User } from '../entity/User';

export class UserService {
  private repository: Repository<User>;

  constructor(repository: Repository<User>) {
    this.repository = repository;
  }

  async inserir(user: User): Promise<User> {
    if(!user.nome || !user.email) {
        throw ({id: 400, msg: "Falta dados obrigatorios"});
    }
    return await this.repository.save(user);
  }

  async listar(): Promise<User[]> {
    return await this.repository.find({ relations: ['vendedor'] });
  }

  async buscarPorId(id: number): Promise<User> {
    let user = await this.repository.findOne({ where: { id }, relations: ['vendedor'] });
    if(!user) {
        throw ({id: 404, msg: "User nao encontrado"});
    }
    return user;
  }

  async atualizar(id: number, user: User): Promise<User> {
    let userAlt = await this.repository.findOneBy({id: id});
    if (!userAlt) {
      throw ({id: 404, msg: "User nao encontrado"});
    }
    Object.assign(userAlt, user);
    return await this.repository.save(userAlt);
  }

  async deletar(id: number): Promise<User> {
    let userDeletado = await this.repository.findOneBy({id: id});
    if (!userDeletado) {
        throw ({id: 404, msg: "User nao encontrado"});
    }
    await this.repository.remove(userDeletado);
    return userDeletado;
  }
}