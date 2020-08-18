const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

let refreshTokens = [];
const users = [];

router.get('/', async (req, res, next) => {
    try {
        users = await User.find().limit(3);
        res.json(users);
    } catch (error) {
        res.status(401).send(error.message);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const exist = await User.findOne({ username: req.body.username })
        if (exist != null) {
            return res.status(401).send('Username { ' + req.body.username + ' } exist.');
        }

        const salt = await bcrypt.genSalt();
        const hashpassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            password: hashpassword
        });

        user.save();
        res.status(201).send("User " + user.username + " has been created");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {

    try {
        const user = User.findOne({ username: req.body.username });
        if (user == null) {
            return res.status(400).send(req.body.username + 'not founded');
        }
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.status(401).send(req.body.username + 'not allowed to login');
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken);
        return res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token != req.body.token);
    res.sendStatus(204);
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = generateAccessToken({ username: user.username, password: user.password });
        res.json({ accessToken: accessToken })
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
}

module.exports = router;