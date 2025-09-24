import express from 'express';
import { ProdutoService } from './service/ProdutoService';
import { ProdutoController } from './controller/ProdutoController';
import { produtoRotas } from './routes/ProdutoRouter';
import { AppDataSource } from './data-source';
import { Produto } from './entity/Produto';
import { Pedido } from './entity/Pedido';
import { PedidoService } from './service/PedidoService';
import { PedidoController } from './controller/PedidoController';
import { pedidoRotas } from './routes/PedidoRouter';

AppDataSource.initialize().then(async => {
  const app = express();
  app.use(express.json());

  // Initialize dependencies 
  //Produto
  const produtoRepository = AppDataSource.getRepository(Produto);
  const produtoService = new ProdutoService(produtoRepository);
  const produtoController = new ProdutoController(produtoService);

  //Pedido
  const pedidoRepository = AppDataSource.getRepository(Pedido);
  const pedidoService = new PedidoService(pedidoRepository);
  const pedidoController = new PedidoController(pedidoService);


  // Routes
  app.use('/api/produtos', produtoRotas(produtoController));
  app.use('/api/pedidos', pedidoRotas(pedidoController));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});