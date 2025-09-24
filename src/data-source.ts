import { DataSource } from "typeorm";
import { Categoria } from "./entity/Categoria";
import { Cliente } from "./entity/Cliente";
import { Pedido } from "./entity/Pedido";
import { Produto } from "./entity/Produto";

export const AppDataSource = new DataSource({
    type: "postgres",    
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "api_ecommerce",
    synchronize: true,
    logging: true,
    // dropSchema: true, //adicionar se quiser limpar o banco
    entities: [Produto, Categoria, Cliente, Pedido],
    subscribers: [],
    migrations: [],
})
