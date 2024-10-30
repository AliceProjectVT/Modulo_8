const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']; 

    if (!token) {
        return res.status(403).send({
            message: 'No continente un token'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'no autorizado'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
