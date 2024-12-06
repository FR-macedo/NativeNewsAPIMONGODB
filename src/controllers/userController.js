const UserService = require('../services/userService');

class UserController {
  // Criar usuário
  async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      // Remover senha antes de enviar resposta
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Obter todos os usuários
  async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.update(id, req.body);
      
      // Remover senha antes de enviar resposta
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
      
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePreferences(req, res) {
    try {
        const { preferences } = req.body;
        const updatedUser = await UserService.updatePreferences(req.user.id, preferences);

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


  // Deletar usuário
  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.delete(id);
      res.status(204).send(); // Sem conteúdo
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}



module.exports = new UserController();