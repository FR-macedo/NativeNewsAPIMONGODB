const Joi = require('joi');

class UserValidation {
  // Validação para registro de usuário
  static registerValidation(data) {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
          'string.min': 'Nome deve ter no mínimo 2 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres',
          'string.empty': 'Nome é obrigatório'
        }),
      
      email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
          'string.email': 'Email inválido',
          'string.empty': 'Email é obrigatório'
        }),
      
      password: Joi.string()
        .trim()
        .min(6)
        .max(30)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .required()
        .messages({
          'string.min': 'Senha deve ter no mínimo 6 caracteres',
          'string.max': 'Senha deve ter no máximo 30 caracteres',
          'string.pattern.base': 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
        })
    });

    return schema.validate(data);
  }

  // Validação para atualização de usuário
  static updateValidation(data) {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
          'string.min': 'Nome deve ter no mínimo 2 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres'
        }),
      
      email: Joi.string()
        .trim()
        .email()
        .messages({
          'string.email': 'Email inválido'
        }),
      
      // Opcional: Validação para troca de senha
      currentPassword: Joi.string().when('newPassword', {
        is: Joi.exist(),
        then: Joi.required().messages({
          'any.required': 'Senha atual é obrigatória para trocar a senha'
        }),
        otherwise: Joi.forbidden()
      }),
      
      newPassword: Joi.string()
        .trim()
        .min(6)
        .max(30)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .messages({
          'string.min': 'Nova senha deve ter no mínimo 6 caracteres',
          'string.max': 'Nova senha deve ter no máximo 30 caracteres',
          'string.pattern.base': 'Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
        })
    });

    return schema.validate(data);
  }
}

module.exports = UserValidation;