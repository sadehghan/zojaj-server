const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const data = [
  {
    email: 's@r.com',
    username: 'dehghan',
    desc: 'www.com'
  },
  {
    email: 'ssaman@r.com',
    username: 'saman',
    desc: 'www.saman.com'
  },
];

router.get('/info', authToken, function (req, res, next) {
  res.json(data.filter(item => item.username == req.user.username));
});

function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }

    req.user = user;
    next();
  })
};

module.exports = router;