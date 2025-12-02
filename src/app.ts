import express from 'express';
import cors from "cors";
import { ProdutoService } from './service/ProdutoService';
import { ProdutoController } from './controller/ProdutoController';
import { produtoRotas } from './routes/ProdutoRouter';
import { AppDataSource } from './data-source';
import { Produto } from './entity/Produto';
import { Pedido } from './entity/Pedido';
import { PedidoService } from './service/PedidoService';
import { PedidoController } from './controller/PedidoController';
import { pedidoRotas } from './routes/PedidoRouter';
import { Carro } from './entity/Carro';
import { carroRotas } from './routes/CarroRouter';
import { CarroController } from './controller/CarroController';
import { CarroService } from './service/CarroService';
import { User } from './entity/User';
import { userRotas } from './routes/UserRouter';
import { UserController } from './controller/UserController';
import { UserService } from './service/UserService';
import { Venda } from "./entity/Venda";
import { VendaService } from "./service/VendaService";
import { VendaController } from "./controller/VendaController";
import { vendaRotas } from "./routes/VendaRouter";

async function waitForDatabase(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🔄 Tentando conectar ao banco... (tentativa ${i + 1}/${retries})`);
            await AppDataSource.initialize();
            console.log("✅ Banco de dados conectado!");
            return true;
        } catch (error) {
            console.log(`⏳ Aguardando banco ficar pronto... (${delay/1000}s)`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("❌ Não foi possível conectar ao banco após várias tentativas");
}

waitForDatabase()
    .then(() => {
        const app = express();
        app.use(cors());
        app.listen(3000, () => {
            console.log("🚀 Servidor rodando na porta 3000");
        });
    })
    .catch(error => {
        console.error(error.message);
        process.exit(1);
    });

AppDataSource.initialize().then(async => {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: "http://localhost:5173", // URL do seu frontend React
    credentials: true
}));

  // Initialize dependencies
  //Produto
  const produtoRepository = AppDataSource.getRepository(Produto);
  const produtoService = new ProdutoService(produtoRepository);
  const produtoController = new ProdutoController(produtoService);

  //Pedido
  const pedidoRepository = AppDataSource.getRepository(Pedido);
  const pedidoService = new PedidoService(pedidoRepository);
  const pedidoController = new PedidoController(pedidoService);

  //Carro
  const carroRepository = AppDataSource.getRepository(Carro);
  const carroService = new CarroService(carroRepository);
  const carroController = new CarroController(carroService);

  //User
  const userRepository = AppDataSource.getRepository(User);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  //Venda
  const vendaRepository = AppDataSource.getRepository(Venda);
  const vendaService = new VendaService(vendaRepository);
  const vendaController = new VendaController(vendaService);

  // Routes
  app.use('/api/produtos', produtoRotas(produtoController));
  app.use('/api/pedidos', pedidoRotas(pedidoController));
  app.use('/api/carros', carroRotas(carroController));
  app.use('/api/users', userRotas(userController));
  app.use("/api/vendas", vendaRotas(vendaController));
  app.use("/api/carro", carroRotas(carroController));
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});