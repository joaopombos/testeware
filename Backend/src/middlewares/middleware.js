const jwt = require('jsonwebtoken');
const jwtSecret = 'seuSegredoAqui';
const Ware = require('../models/ware'); 

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Token inválido.' });
      }

      req.user = decoded;
      next();
  });
};

const isBuyer = (req, res, next) => {
  if (req.user.iduser !== 1) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  next();
};

const isManager = (req, res, next) => {
  if (req.user.iduser !== 2) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  next();
};

const isAdmin = async (req, res, next) => {
  try {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ error: 'Acesso negado. Token não fornecido.' });
    }


    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Acesso negado. Token inválido.' });
      }

  
      const admin = await Ware.findOne({ where: { idware: decoded.idware, username: decoded.username } });

      if (!admin) {
        return res.status(403).json({ error: 'Acesso negado. Não é um administrador válido.' });
      }

      
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar administrador', details: error.message });
  }
};

module.exports = { isAuthenticated, isBuyer, isManager, isAdmin };




  