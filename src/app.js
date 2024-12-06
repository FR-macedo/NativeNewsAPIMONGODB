const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const errorHandler = require('./middleware/errorHandler');
const AuthMiddleware = require('./middleware/authMiddleware');

class App {
  constructor() {
    this.express = express();
    this.initialize();
  }

  initialize() {
    this.loadEnvironmentVariables();
    this.connectDatabase();
    this.configCORS();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  // Carregar variáveis de ambiente
  loadEnvironmentVariables() {
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config(); // Carregar .env em ambiente de desenvolvimento
    }
  }

  // Conectar ao banco de dados
  async connectDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Conectado ao MongoDB');
    } catch (error) {
      console.error('Erro na conexão com o MongoDB:', error.message);
      process.exit(1);
    }
  }

  // Configuração de CORS
  configCORS() {
    const corsOptions = {
      origin: (origin, callback) => {
        const whiteList = [
          'http://localhost:3000',
          'http://localhost:5173',
          'https://seu-dominio-de-producao.com'
        ];
        if (!origin || whiteList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200
    };

    this.express.use(cors(corsOptions));
  }

  // Middlewares globais
  middlewares() {
    this.express.use(express.json());

    // Middleware de logging para debug
    if (process.env.NODE_ENV === 'development') {
      this.express.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url}`);
        next();
      });
    }

    // Headers customizados
    this.express.use((req, res, next) => {
      res.header('X-Powered-By', 'Your API Name'); // Personalização opcional
      next();
    });
  }

  // Rotas da aplicação
  routes() {
    this.express.use('/auth', authRoutes); // Rotas de autenticação
    this.express.use('/users', AuthMiddleware.authenticate, userRoutes); // Rotas protegidas de usuários
    this.express.use('/favorites', AuthMiddleware.authenticate, favoriteRoutes); // Rotas protegidas de favoritos

    // Verificação de saúde da API
    this.express.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    });
  }

  // Tratamento de erros
  errorHandling() {
    // Middleware de tratamento de erros
    this.express.use(errorHandler);

    // Middleware para rotas não encontradas
    this.express.use((req, res) => {
      res.status(404).json({ message: 'Rota não encontrada' });
    });

    // Middleware global para erros não tratados
    this.express.use((err, req, res, next) => {
      console.error('Erro não tratado:', err.message);
      res.status(500).json({ message: 'Erro interno no servidor' });
    });
  }
}

module.exports = new App();
