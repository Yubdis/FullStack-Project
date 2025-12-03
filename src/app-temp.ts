// src/app-temp.ts - USE ANY PARA SIMPLIFICAR
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ========== DADOS MOCK ==========
const usuariosMock = [
    { id: 1, nome: "João Silva", email: "joao@email.com" },
    { id: 2, nome: "Maria Santos", email: "maria@email.com" },
    { id: 3, nome: "Carlos Mendes", email: "carlos@email.com" },
    { id: 4, nome: "Ana Paula", email: "ana@email.com" },
    { id: 5, nome: "Roberto Almeida", email: "roberto@email.com" }
];

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

// ========== CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ==========
const __dirname = path.resolve();
const uploadsPath = path.join(__dirname, 'public', 'uploads');

if (fs.existsSync(uploadsPath)) {
    console.log('✅ Pasta uploads encontrada:', uploadsPath);
    app.use('/uploads', express.static(uploadsPath));
} else {
    console.log('📁 Criando pasta uploads:', uploadsPath);
    fs.mkdirSync(uploadsPath, { recursive: true });
    app.use('/uploads', express.static(uploadsPath));
}

// ========== AUTENTICAÇÃO ==========
const sessoes: { [key: string]: number } = {}; // token -> userId

// Middleware de autenticação
const autenticar = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !sessoes[token]) {
        return res.status(401).json({ error: "Não autorizado" });
    }
    
    req.userId = sessoes[token];
    next();
};

// ========== ROTAS PÚBLICAS ==========

// Saúde da API
app.get("/", (req: any, res: any) => {
    res.json({ 
        message: "🚗 API CarHome funcionando!",
        status: "online",
        carros_cadastrados: carrosMock.length,
        usuarios_cadastrados: usuariosMock.length,
        endpoints: {
            "GET /api/carros": "Listar todos os carros",
            "GET /api/carros/:id": "Buscar carro por ID",
            "POST /api/carros": "Cadastrar novo carro (autenticado)",
            "PUT /api/carros/:id": "Atualizar carro (autenticado)",
            "DELETE /api/carros/:id": "Remover carro (autenticado)",
            "POST /api/login": "Login/Registro",
            "GET /api/usuarios": "Listar usuários"
        }
    });
});

// Login/Registro
app.post("/api/login", (req: any, res: any) => {
    const { email, nome } = req.body;
    console.log("🔐 Login attempt:", { email, nome });
    
    let usuario = usuariosMock.find(u => u.email === email);
    
    if (!usuario) {
        const novoId = usuariosMock.length + 1;
        usuario = { id: novoId, nome, email };
        usuariosMock.push(usuario);
        console.log("👤 Novo usuário criado:", usuario);
    }
    
    const token = `token-${Date.now()}-${usuario.id}`;
    sessoes[token] = usuario.id;
    
    res.json({
        success: true,
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    });
});

// ========== ROTAS DE CARROS ==========

// Listar todos os carros
app.get("/api/carros", (req: any, res: any) => {
    console.log("📦 GET /api/carros - Enviando", carrosMock.length, "carros");
    res.json(carrosMock);
});

// Buscar carro por ID
app.get("/api/carros/:id", (req: any, res: any) => {
    const carroId = parseInt(req.params.id);
    console.log(`🔍 GET /api/carros/${carroId} solicitado`);
    
    const carro = carrosMock.find(c => c.id === carroId);
    
    if (!carro) {
        console.log(`❌ Carro ID ${carroId} não encontrado`);
        return res.status(404).json({ error: "Carro não encontrado" });
    }
    
    console.log(`✅ Carro encontrado: ${carro.marca} ${carro.modelo}`);
    res.json(carro);
});

// Cadastrar novo carro (autenticado)
app.post("/api/carros", autenticar, (req: any, res: any) => {
    console.log("📝 POST /api/carros - Recebido:", req.body);
    
    const { marca, modelo, ano, preco, quilometragem, cor, descricao, imagem } = req.body;
    const userId = req.userId;
    
    // Validação
    if (!marca || !modelo || !ano || !preco || !quilometragem || !cor) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }
    
    const novoCarro = {
        id: Date.now(),
        marca,
        modelo,
        ano: Number(ano),
        preco: Number(preco),
        quilometragem: Number(quilometragem),
        cor,
        descricao: descricao || "",
        vendedor: userId,
        imagem: imagem || "https://images.unsplash.com/photo-1563720223480-8ddab2319e1a?w=400"
    };
    
    carrosMock.push(novoCarro);
    console.log(`✅ Carro adicionado por usuário ${userId}. Total:`, carrosMock.length);
    res.status(201).json(novoCarro);
});

// Atualizar carro (autenticado - apenas dono)
app.put("/api/carros/:id", autenticar, (req: any, res: any) => {
    const carroId = parseInt(req.params.id);
    console.log(`✏️ PUT /api/carros/${carroId} solicitado`);
    console.log('📝 Dados recebidos:', req.body);
    
    const carroIndex = carrosMock.findIndex(c => c.id === carroId);
    
    if (carroIndex === -1) {
        return res.status(404).json({ error: "Carro não encontrado" });
    }
    
    const carro = carrosMock[carroIndex];
    const userId = req.userId;
    
    // Verifica se o usuário é o dono
    if (carro.vendedor !== userId) {
        return res.status(403).json({ error: "Você não é o dono deste anúncio" });
    }
    
    const atualizacoes = req.body;
    // Remove campos que não podem ser atualizados
    delete atualizacoes.id;
    delete atualizacoes.vendedor;
    
    // Atualiza o carro
    carrosMock[carroIndex] = { ...carro, ...atualizacoes };
    
    console.log(`✅ Carro ${carroId} atualizado por usuário ${userId}`);
    res.json(carrosMock[carroIndex]);
});

// Remover carro (autenticado)
app.delete("/api/carros/:id", autenticar, (req: any, res: any) => {
    const carroId = parseInt(req.params.id);
    console.log(`🗑️ DELETE /api/carros/${carroId} solicitado`);
    
    const carroIndex = carrosMock.findIndex(c => c.id === carroId);
    
    if (carroIndex === -1) {
        return res.status(404).json({ 
            error: "Carro não encontrado",
            message: `Carro com ID ${carroId} não existe`
        });
    }
    
    const carroRemovido = carrosMock[carroIndex];
    const userId = req.userId;
    
    // Opcional: verificar se é dono (comente para permitir qualquer um comprar)
    // if (carroRemovido.vendedor !== userId) {
    //     return res.status(403).json({ error: "Apenas o dono pode remover" });
    // }
    
    carrosMock.splice(carroIndex, 1);
    
    console.log(`✅ Carro ${carroRemovido.marca} ${carroRemovido.modelo} removido por usuário ${userId}`);
    console.log(`📊 Carros restantes: ${carrosMock.length}`);
    
    res.status(200).json({
        success: true,
        message: `Carro ${carroRemovido.marca} ${carroRemovido.modelo} removido com sucesso`,
        carro: carroRemovido,
        carrosRestantes: carrosMock.length
    });
});

// Comprar carro (alternativa com processamento)
app.post("/api/carros/:id/comprar", autenticar, (req: any, res: any) => {
    const carroId = parseInt(req.params.id);
    const { compradorId } = req.body;
    const userId = req.userId;
    
    console.log(`🛒 Tentativa de compra - Carro ID: ${carroId}, Comprador: ${compradorId || userId}`);
    
    const carroIndex = carrosMock.findIndex(c => c.id === carroId);
    
    if (carroIndex === -1) {
        return res.status(404).json({ error: "Carro não encontrado" });
    }
    
    const carro = carrosMock[carroIndex];
    
    // Processamento simulado
    setTimeout(() => {
        carrosMock.splice(carroIndex, 1);
        
        console.log(`✅ Carro ${carro.marca} ${carro.modelo} vendido para usuário ${userId}`);
        
        res.json({
            success: true,
            message: `🎉 Compra realizada com sucesso!`,
            carro: carro,
            compradorId: compradorId || userId,
            dataCompra: new Date().toISOString(),
            total: carro.preco
        });
    }, 1000); 
});

// ========== ROTAS DE USUÁRIOS ==========

// Listar usuários
app.get("/api/usuarios", (req: any, res: any) => {
    res.json(usuariosMock);
});

// Criar usuário (alternativa ao login automático)
app.post("/api/usuarios", (req: any, res: any) => {
    const { nome, email } = req.body;
    const novoUsuario = {
        id: Date.now(),
        nome: String(nome),
        email: String(email)
    };
    usuariosMock.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// ========== ROTAS AUXILIARES ==========

// Teste de uploads
app.get('/test-upload', (req: any, res: any) => {
    res.json({
        caminho: uploadsPath,
        existe: fs.existsSync(uploadsPath),
        arquivos: fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : []
    });
});

// Carros disponíveis (alias para /api/carros)
app.get("/api/carros/disponiveis", (req: any, res: any) => {
    res.json(carrosMock);
});

// ========== INICIALIZAÇÃO ==========
const PORT = 3000;
app.listen(PORT, () => {
    console.log("=========================================");
    console.log("🚗 CARHOME BACKEND TEMPORÁRIO");
    console.log("=========================================");
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📊 ${carrosMock.length} carros carregados`);
    console.log(`👤 ${usuariosMock.length} usuários carregados`);
    console.log(`🔗 Frontend: http://localhost:5173`);
    console.log(`🔗 API: http://localhost:${PORT}/api/carros`);
    console.log(`🌐 Health: http://localhost:${PORT}`);
    console.log("=========================================");
    console.log("📌 Rotas disponíveis:");
    console.log("   GET    /api/carros");
    console.log("   GET    /api/carros/:id");
    console.log("   POST   /api/carros (auth)");
    console.log("   PUT    /api/carros/:id (auth)");
    console.log("   DELETE /api/carros/:id (auth)");
    console.log("   POST   /api/login");
    console.log("=========================================");
});