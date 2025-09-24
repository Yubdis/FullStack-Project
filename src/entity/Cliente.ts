import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./Pedido";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @Column()
    email?: string;
    @OneToMany(()=> Pedido, (pedido) => pedido.cliente)
    pedidos?: Pedido[];
}