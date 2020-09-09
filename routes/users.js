const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const User = require('../models/User');

router.get('/bookmarkedfeeds', authorization, async function (req, res) {
  try {
    const bookmarkedFeeds = await User.findById(req.body.userId, 'bookmarkedFeeds');
    res.status(200).json({ status: 'successful', message: 'fetched bookmarked feeds successfully.', data: bookmarkedFeeds });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.get('/userinfobyid', authorization, async function (req, res) {
  try {
    const username = await User.findById(req.body.userId, 'username');
    res.status(200).json({ status: 'successful', message: 'fetched username successfully.', data: username });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.get('/useridbyname', authorization, async function (req, res) {
  try {
    const user = await User.find({username: req.body.username}, "_id");
    res.status(200).json({ status: 'successful', message: 'fetched username successfully.', data: user });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.get('/searchuserinfo', authorization, async function (req, res) {
  try {
    const re = new RegExp(req.body.regex);
    const usernames = await User.find({ username: { $regex: re } }, 'username').limit(req.body.limit);
    res.status(200).json({ status: 'successful', message: 'fetched match feeds successfully.', data: usernames });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

module.exports = router;