import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Cliente } from "./Cliente";

@Entity()
export class Carro {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column()
    ano: number;

    @Column()
    preco: number;

    @Column()
    quilometragem: number;

    @Column()
    cor: string;

    @Column({ nullable: true })
    descricao?: string;

    @ManyToOne(() => Cliente, (cliente) => cliente.id)
    vendedor: Cliente;
}