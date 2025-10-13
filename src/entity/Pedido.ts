import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Produto } from "./Produto";
import { Carro } from "./Carro";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn("uuid")
    id?: string;
    @Column('timestamp')
    dataHora?: Date;
    // @ManyToOne(()=> User, (user) => user.pedidos)
    cliente?: User;
    @ManyToMany(() => Produto)
    @JoinTable()
    listaProdutos?: Produto[];

    @ManyToMany(() => Carro)
    @JoinTable()
    listaCarros?: Carro[];
}