require('dotenv').config();

var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const users = [];
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

let refreshTokens = [];

/* GET users listing. */
router.get('/data', authToken, function (req, res, next) {
  res.json(data.filter(item => item.username == req.user.username));
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.name, password: hashpassword };
    users.push(user);
    console.log(salt, hashpassword);
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const user = users.find(user => user.username = req.body.username);
  if (user == null) {
    res.status(400).send('cannot find');
  }
  try {
    if (!await bcrypt.compare(req.body.password, user.password)) {
      res.send('Not allowed');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log('USER : => ',user);
    const accessToken = generateAccessToken(user);
    res.json({accessToken: accessToken})
  })
});

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token != req.body.token);
  res.sendStatus(204);
});

function authToken(req, res, next) {
  console.log(req.headers['authorization']);

  const authHeader = req.headers['authorization'];

  console.log('HEADER', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  })
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'});
}

module.exports = router;
