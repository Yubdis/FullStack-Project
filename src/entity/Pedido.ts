import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Produto } from "./Produto";
import { Carro } from "./Carro";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn("uuid")
    id?: string;
    @Column('timestamp')
    dataHora?: Date;
    @ManyToOne(()=> Cliente, (cliente) => cliente.pedidos)
    cliente?: Cliente;
    @ManyToMany(() => Produto)
    @JoinTable()
    listaProdutos?: Produto[];

    @ManyToMany(() => Carro)
    @JoinTable()
    listaCarros?: Carro[];
}