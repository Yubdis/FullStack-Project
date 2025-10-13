import { DataSource } from "typeorm";
import { Categoria } from "./entity/Categoria";
import { User } from "./entity/User";
import { Pedido } from "./entity/Pedido";
import { Produto } from "./entity/Produto";
import { Carro } from "./entity/Carro";

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
    entities: [Produto, Categoria, User, Pedido, Carro],
    subscribers: [],
    migrations: [],
})
