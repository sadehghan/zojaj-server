const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(400).json({ status: 'failed', message: 'Token has not been found.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(401).json({ status: 'failed', message: 'Unauthorised, the user does not have valid authentication credentials for the target resource. [ ' + error.message  + ' ]' });
        }

        req.user = user;
        next();
    })
};