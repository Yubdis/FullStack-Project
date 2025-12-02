// src/app-temp.ts - BACKEND TEMPORÁRIO COMPLETO
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Dados mock de usuários
const usuariosMock = [
    { id: 1, nome: "João Silva", email: "joao@email.com" },
    { id: 2, nome: "Maria Santos", email: "maria@email.com" },
    { id: 3, nome: "Carlos Mendes", email: "carlos@email.com" },
    { id: 4, nome: "Ana Paula", email: "ana@email.com" },
    { id: 5, nome: "Roberto Almeida", email: "roberto@email.com" }
];

const __dirname = path.resolve(); // Pega o diretório atual

// ✅ TENTE ESTES CAMINHOS (um por um):

// Opção A: Caminho relativo a partir de onde o app é executado
const uploadsPath = path.join(__dirname, 'public', 'uploads');
console.log('📁 Tentando acessar:', uploadsPath)

if (fs.existsSync(uploadsPath)) {
    console.log('✅ Pasta encontrada:', uploadsPath);
    app.use('/uploads', express.static(uploadsPath));
} else {
    console.error('❌ Pasta NÃO encontrada:', uploadsPath);
    
    // Crie a pasta para teste
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('📁 Pasta criada:', uploadsPath);
    
    // Crie um arquivo de teste
    const testImage = path.join(uploadsPath, 'teste.txt');
    fs.writeFileSync(testImage, 'Arquivo de teste');
    app.use('/uploads', express.static(uploadsPath));
}

// Rota de teste
app.get('/test-upload', (req, res) => {
    res.json({
        caminho: uploadsPath,
        existe: fs.existsSync(uploadsPath),
        arquivos: fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : []
    });
});

// Dados mock de carros
const carrosMock = [
    {
        id: 1,
        marca: "Volkswagen",
        modelo: "Golf",
        ano: 2020,
        preco: 85000,
        quilometragem: 45000,
        cor: "preto",
        descricao: "Carro em perfeito estado, único dono",
        vendedor: 1,
        imagem: "volkswagengolf.jpg"
    },
    {
        id: 2,
        marca: "Honda",
        modelo: "Civic",
        ano: 2019,
        preco: 95000,
        quilometragem: 35000,
        cor: "prata",
        descricao: "Excelente estado, revisões em concessionária",
        vendedor: 2,
        imagem: "hondacivic.jpg"
    },
    {
        id: 3,
        marca: "Toyota",
        modelo: "Corolla",
        ano: 2021,
        preco: 98000,
        quilometragem: 22000,
        cor: "prata",
        descricao: "Seminovo, completo, econômico",
        vendedor: 3,
        imagem: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400"
    },
    {
        id: 4,
        marca: "Ford",
        modelo: "Ranger",
        ano: 2019,
        preco: 115000,
        quilometragem: 55000,
        cor: "azul",
        descricao: "Picape 4x4 diesel, excelente para trabalho",
        vendedor: 4,
        imagem: "/uploads/fordranger.jpg"
    }
];

// ========== ROTAS DA API ==========

// GET - Listar todos os carros
app.get("/api/carros", (req, res) => {
    console.log("📦 GET /api/carros - Enviando", carrosMock.length, "carros");
    res.json(carrosMock);
});

// POST - Cadastrar novo carro
app.post("/api/carros", (req, res) => {
    console.log("📝 POST /api/carros - Recebido:", req.body);
    
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, vendedor, imagem } = req.body;
    
    // Validação básica
    if (!marca || !modelo || !ano || !preco || !quilometragem || !cor || !vendedor) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }
    
    // Verificar se vendedor existe
    const usuarioExiste = usuariosMock.find(u => u.id === vendedor);
    if (!usuarioExiste) {
        return res.status(400).json({ error: "Vendedor não encontrado" });
    }
    
    const novoCarro = {
        id: Date.now(),
        marca: String(marca),
        modelo: String(modelo),
        ano: Number(ano),
        preco: Number(preco),
        quilometragem: Number(quilometragem),
        cor: String(cor),
        descricao: descricao ? String(descricao) : "",
        vendedor: Number(vendedor),
        imagem: imagem ? String(imagem) : "https://images.unsplash.com/photo-1563720223480-8ddab2319e1a?w=400"
    };
    
    carrosMock.push(novoCarro);
    console.log("✅ Carro adicionado. Total:", carrosMock.length);
    res.status(201).json(novoCarro);
});

app.delete("/api/carros/:id", (req, res) => {
    const carroId = parseInt(req.params.id);
    console.log(`🗑️ DELETE /api/carros/${carroId} solicitado`);
    
    // 1. Encontrar o carro
    const carroIndex = carrosMock.findIndex(c => c.id === carroId);
    
    if (carroIndex === -1) {
        return res.status(404).json({ 
            error: "Carro não encontrado",
            message: `Carro com ID ${carroId} não existe`
        });
    }
    
    const carroRemovido = carrosMock[carroIndex];
    
    // 2. Remover do array
    carrosMock.splice(carroIndex, 1);
    
    console.log(`✅ Carro ${carroRemovido.marca} ${carroRemovido.modelo} removido`);
    console.log(`📊 Carros restantes: ${carrosMock.length}`);
    
    // 3. Retornar confirmação
    res.status(200).json({
        success: true,
        message: `Carro ${carroRemovido.marca} ${carroRemovido.modelo} removido com sucesso`,
        carro: carroRemovido,
        carrosRestantes: carrosMock.length
    });
});


// GET - Listar usuários
app.get("/api/usuarios", (req, res) => {
    res.json(usuariosMock);
});

// POST - Criar usuário
app.post("/api/usuarios", (req, res) => {
    const { nome, email } = req.body;
    const novoUsuario = {
        id: Date.now(),
        nome: String(nome),
        email: String(email)
    };
    usuariosMock.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// Rota de saúde
app.get("/", (req, res) => {
    res.json({ 
        message: "🚗 API CarHome (Backend Temporário) funcionando!",
        status: "online",
        carros_cadastrados: carrosMock.length,
        usuarios_cadastrados: usuariosMock.length,
        endpoints: {
            "GET /api/carros": "Listar todos os carros",
            "POST /api/carros": "Cadastrar novo carro",
            "GET /api/usuarios": "Listar usuários",
            "POST /api/usuarios": "Criar novo usuário"
        }
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log("=========================================");
    console.log("🚗 CARHOME BACKEND TEMPORÁRIO");
    console.log("=========================================");
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📊 ${carrosMock.length} carros carregados`);
    console.log(`👤 ${usuariosMock.length} usuários carregados`);
    console.log(`🔗 Frontend deve apontar para: http://localhost:${PORT}/api/carros`);
    console.log(`🌐 API Health: http://localhost:${PORT}`);
    console.log("=========================================");
});

// ========== NOVA ROTA: COMPRAR CARRO ==========

// POST - Comprar carro (simplificado)
app.post("/api/carros/:id/comprar", (req, res) => {
    const carroId = parseInt(req.params.id);
    const { compradorId } = req.body;
    
    console.log(`🛒 Tentativa de compra - Carro ID: ${carroId}, Comprador: ${compradorId}`);
    
    // 1. Encontrar o carro
    const carroIndex = carrosMock.findIndex(c => c.id === carroId);
    
    if (carroIndex === -1) {
        return res.status(404).json({ error: "Carro não encontrado" });
    }
    
    const carro = carrosMock[carroIndex];
    
    // 2. Simular processamento (em um sistema real, aqui teria validação de pagamento, etc)
    setTimeout(() => {
        // 3. Remover carro da lista (simula venda)
        carrosMock.splice(carroIndex, 1);
        
        console.log(`✅ Carro ${carro.marca} ${carro.modelo} vendido para comprador ${compradorId}`);
        
        // 4. Retornar confirmação
        res.json({
            success: true,
            message: `🎉 Compra realizada com sucesso!`,
            carro: carro,
            compradorId: compradorId,
            dataCompra: new Date().toISOString(),
            total: carro.preco
        });
    }, 1000); // Simula delay de processamento
});

// GET - Ver carros disponíveis (já existe, só lembrando)
app.get("/api/carros/disponiveis", (req, res) => {
    res.json(carrosMock);
});