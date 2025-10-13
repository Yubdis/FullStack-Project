import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Categoria } from "./Categoria";

@Entity()
export class Carro {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    marca?: string;
    @Column()
    modelo?: string;
    @Column()
    ano?: number;
    @Column("decimal")
    preco?: number;
    @Column()
    quilometragem?: number;
    @Column()
    cor?: string;
    @Column({ nullable: true })
    descricao?: string;
    @ManyToOne(() => User, (user) => user.id)
    vendedor?: User;
    @ManyToOne(() => Categoria, (categoria) => categoria.carros)
    categoria?: Categoria;
}