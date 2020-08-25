const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const Feed = require('../models/Feed');
const User = require('../models/User');

router.get('/', authorization, async function (req, res) {
  try {
    const feeds = await Feed.find({}).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
    res.status(200).json({ status: 'successful', message: 'fetched feeds successfully.', data: feeds });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/filter', authorization, async function (req, res) {
  try {
    const feeds = await Feed.find({ source: req.body.source }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
    res.status(200).json({ status: 'successful', message: 'fetched feeds by sources successfully.', data: feeds });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/top', authorization, async function (req, res) {
  try {
    const feeds = await Feed.find({}).sort({ likesNo: -1 }).limit(req.body.limit);
    res.status(200).json({ status: 'successful', message: 'fetched top feeds successfully.', data: feeds });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/search', authorization, async function (req, res) {
  try {
    const feeds = await Feed.find({ news: { $regex: req.body.regex } }).limit(req.body.limit);
    res.status(200).json({ status: 'successful', message: 'fetched match feeds successfully.', data: feeds });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/like/:feedId', authorization, async function (req, res) {
  try {
    const result = await Feed.findOneAndUpdate({ _id: req.params.feedId }, { $push: { likers: req.body.likerId }, $inc: { likesNo: 1 } });
    res.status(200).json({ status: 'successful', message: 'feed { ' + req.params.feedId + ' } has been liked' });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/comment/:feedId', authorization, async function (req, res) {
  try {
    const result = await Feed.findOneAndUpdate({ _id: req.params.feedId }, { $push: { comments: { commenterId: req.body.commenterId, comment: req.body.comment } }, $inc: { commentsNo: 1 } });
    res.status(200).json({ status: 'successful', message: 'Comment { ' + req.body.comment + '} has been added to feed {' + req.params.feedId + '} by { ' + req.body.commenterId + '}' });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/bookmark/:feedId', authorization, async function (req, res) {
  try {
    const result = await User.findOneAndUpdate({ _id: req.body.userId }, { $push: { bookmarkedFeeds: req.params.feedId } });
    res.status(200).json({ status: 'successful', message: 'feed { ' + req.params.feedId + '} has been added to user {' + req.body.userId + '} bookmarks.' });
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error.message });
  }
});

router.post('/add/', authorization, async function (req, res) {
  try {
    const feed = new Feed(req.body);
    await feed.save();
    return res.status(201).json({ status: 'successful', message: ' feed successfully added'});
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: error.message });
  }
});

module.exports = router;