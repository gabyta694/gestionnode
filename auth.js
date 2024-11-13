const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401); // Sin token

  jwt.verify(token, 'TU_CLAVE_SECRETA', (err, user) => {
    if (err) return res.sendStatus(403); // Token no válido
    req.user = user; // Almacena la información del usuario en req.user
    next(); // Continúa a la siguiente función
  });
};

module.exports = authenticateToken;
