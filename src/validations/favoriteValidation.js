const Joi = require('joi');

class FavoriteValidation {
  // Validação para criação de favorito
  static createValidation(data) {
    const schema = Joi.object({
      title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
          'string.min': 'Título deve ter no mínimo 2 caracteres',
          'string.max': 'Título deve ter no máximo 200 caracteres',
          'string.empty': 'Título é obrigatório'
        }),
      
      newsUrl: Joi.string()
        .trim()
        .uri()
        .required()
        .messages({
          'string.uri': 'URL inválida',
          'string.empty': 'URL da notícia é obrigatória'
        }),
      
      description: Joi.string()
        .trim()
        .allow(null, '')
        .max(500)
        .messages({
          'string.max': 'Descrição deve ter no máximo 1000 caracteres'
        }),
      
      imageUrl: Joi.string()
        .trim()
        .uri()
        .allow(null, '')
        .messages({
          'string.uri': 'URL da imagem inválida'
        }),
        category: Joi.string()
      .trim()
      .max(50)
      .messages({
        'string.max': 'Categoria deve ter no máximo 50 caracteres'
      })
    });

    return schema.validate(data);
  }

  // Validação para atualização de favorito
  static updateValidation(data) {
    const schema = Joi.object({
      title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .messages({
          'string.min': 'Título deve ter no mínimo 2 caracteres',
          'string.max': 'Título deve ter no máximo 200 caracteres'
        }),
      
      description: Joi.string()
        .trim()
        .allow(null, '')
        .max(500)
        .messages({
          'string.max': 'Descrição deve ter no máximo 500 caracteres'
        }),
      
      imageUrl: Joi.string()
        .trim()
        .uri()
        .allow(null, '')
        .messages({
          'string.uri': 'URL da imagem inválida'
        }),
        category: Joi.string()
      .trim()
      .max(50)
      .messages({
        'string.max': 'Categoria deve ter no máximo 50 caracteres'
      })
    });

    return schema.validate(data);
  }
}

module.exports = FavoriteValidation;