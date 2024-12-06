const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

class AuthMiddleware {
  // Gerar token JWT
  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '1d' 
      }
    );
  }

  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
      }
  
      const parts = authHeader.split(' ');
  
      if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token.' });
      }
  
      const [scheme, token] = parts;
  
      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token mal formatado.' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.user = { id: decoded.id };
  
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido.', error: error.message });
    }
  }
  

  // Middleware para verificar permissões de admin
  async adminOnly(req, res, next) {
    try {
      const user = await UserService.findUserById(req.user.id);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        message: 'Erro na verificação de permissões', 
        error: error.message 
      });
    }
  }

  // Login do usuário
  async login(email, password) {
    const user = await UserService.findUserByEmail(email);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await UserService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Senha incorreta');
    }

    return this.generateToken(user);
  }
}

module.exports = new AuthMiddleware();