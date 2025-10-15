import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carro } from './Carro';
import { User } from './User';

@Entity()
export class Venda {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Carro, (carro) => carro.vendas)
    @JoinColumn({ name: 'carroId' })
    carro?: Carro;

    @ManyToOne(() => User, (user) => user.compras)
    @JoinColumn({ name: 'compradorId' })
    comprador?: User;

    @ManyToOne(() => User, (user) => user.vendas)
    @JoinColumn({ name: 'vendedorId' })
    vendedor?: User;

    @Column('decimal', { precision: 10, scale: 2 })
    precoVenda?: number;

    @Column()
    dataVenda?: Date;

    @Column({ default: 'pendente' })
    status?: string; // 'pendente', 'concluida', 'cancelada'

    @Column({ nullable: true })
    formaPagamento?: string;

    @Column({ nullable: true })
    observacoes?: string;
}