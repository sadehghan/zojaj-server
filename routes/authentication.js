const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

let refreshTokens = [];

router.post('/signup', async (req, res) => {
    try {
        const exist = await User.findOne({ username: req.body.username })
        if (exist != null) {
            return res.status(406).json({ status: 'failed', message: 'User { ' + req.body.username + ' } is already exist.' });
        }

        const salt = await bcrypt.genSalt();
        const hashpassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            password: hashpassword
        });

        const result = user.save();
        return res.status(201).json({ status: 'successful', message: 'User has been created successfully.' });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username });
        if (user == null) {
            return res.status(404).json({ status: 'failed', message: 'User { ' + req.body.username + ' } not exist.' });
        }
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.status(401).json({ status: 'failed', message: 'Password is incorrect.' });
        }

        const accessToken = generateAccessToken({ username: user.username, password: user.password });
        const refreshToken = jwt.sign({ username: user.username, password: user.password }, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken);

        return res.status(200).json({ status: 'successful', message: 'User {' + req.body.username + ' } has been logged in successfully.', data: { userId: user._id, accessToken: accessToken, refreshToken: refreshToken } });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/logout', (req, res) => {
    // TODO: is it a good way to remove refresh token? how expire access token ? 
    refreshTokens = refreshTokens.filter(token => token != req.body.token);
    res.sendStatus(204);
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) {
        return res.status(400).json({ status: 'failed', message: 'Token has not been found.' });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(401).json({ status: 'failed', message: 'Unauthorised, the user does not have valid authentication credentials for the target resource.' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(401).json({ status: 'failed', message: 'Unauthorised, the user does not have valid authentication credentials for the target resource. [ ' + error.message + ' ]' });
        }

        const accessToken = generateAccessToken({ username: user.username, password: user.password });
        res.status(200).json({ status: 'successful', message: 'Access token has been refreshed successfuly.', data: { accessToken: accessToken } })
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50m' });
}

module.exports = router;
