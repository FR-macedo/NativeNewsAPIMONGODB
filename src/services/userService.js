const User = require("../models/User");
const bcrypt = require("bcryptjs");
const UserValidation = require("../validations/userValidation");

class UserService {
  // Criar usuário com validações
  async createUser(userData) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
  
      const newUser = new User({
        ...userData,
        password: hashedPassword,
      });
  
      await newUser.save();
      return newUser;
      console.log("Usuário criado com sucesso!")
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }
  
  // Atualizar preferências do usuário
async updatePreferences(req, res) {
  try {
    const { preferences } = req.body;

    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: 'As preferências devem ser um array de strings.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json({ message: 'Preferências atualizadas com sucesso.', preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar preferências.', error: error.message });
  }
}


  // Atualizar usuário com validações de senha
  async update(userId, updateData) {
    try {
      // Validação dos dados
      const { error } = UserValidation.updateValidation(updateData);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Lógica para troca de senha
      if (updateData.newPassword) {
        // Verificar senha atual
        const isPasswordValid = await bcrypt.compare(
          updateData.currentPassword,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Senha atual incorreta");
        }

        // Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(updateData.newPassword, salt);
      }

      // Atualizar outros campos
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) {
        // Verificar se novo email já existe
        const existingEmail = await User.findOne({
          email: updateData.email,
          _id: { $ne: userId },
        });

        if (existingEmail) {
          throw new Error("Email já está em uso");
        }
        user.email = updateData.email;
      }

      return await user.save();
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error(`Erro ao buscar usuário por email: ${email}`, error);
      throw new Error("Não foi possível buscar o usuário. Tente novamente.");
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserService();
