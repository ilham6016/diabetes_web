function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'มีบางอย่างผิดพลาดในระบบ' });
  }
  
  module.exports = errorHandler;
  