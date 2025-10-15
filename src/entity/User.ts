import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./Pedido";
import { Carro } from "./Carro";
import { Venda } from "../entity/Venda";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    nome?: string;

    @Column()
    email?: string;

    @OneToMany(() => Venda, (venda) => venda.comprador)
    compras?: Venda[];

    @OneToMany(() => Venda, (venda) => venda.vendedor)
    vendas?: Venda[];
    // password for login/authentication purposes
    // @Column()
    // password?: string
    // @Column()
    // vendedor?: boolean;
    // @Column()
    // vendedorId?: number;
    @OneToMany(() => Carro, (carro) => carro.vendedor)
    carros?: Carro[];
    @OneToMany(()=> Pedido, (pedido) => pedido.cliente)
    pedidos?: Pedido[];
}