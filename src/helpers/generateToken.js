const jwt = require('jsonwebtoken');

const generateToken = (payload) => { 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    if (!token) {
        throw new Error("Failed to generate token");
    }

    return token;
}

module.exports = generateToken;