const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
  };
  
  module.exports = errorHandler;