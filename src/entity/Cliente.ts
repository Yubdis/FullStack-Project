import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./Pedido";
import { Carro } from "./Carro";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @Column()
    email?: string;
    @Column()
    vendedor?: boolean;
    @Column()
    vendedorId?: number;
    @OneToMany(() => Carro, (carro) => carro.vendedor)
    carros?: Carro[];
    @OneToMany(()=> Pedido, (pedido) => pedido.cliente)
    pedidos?: Pedido[];
}