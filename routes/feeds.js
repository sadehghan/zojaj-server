const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const Feed = require('../models/Feed');

router.get('/', authorization, async function (req, res) {
  try {
    let feeds = await Feed.find({}).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
    res.status(201).json(feeds);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get('/:source/', authorization, async function (req, res) {
  try {
    let feeds = await Feed.find({ source: req.params.source }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
    res.status(201).json(feeds);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get('/top/', authorization, async function (req, res) {
  try {
    let feeds = await Feed.find({}).sort({ likesNo: -1 }).limit(req.body.limit);
    res.status(201).json(feeds);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get('/search/', authorization, async function (req, res) {
  try {
    let feeds = await Feed.find({ news: { $regex: req.body.regex } }).limit(req.body.limit);
    res.status(201).json(feeds);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post('/like/:feedId', authorization, async function (req, res) {
  try {
    Feed.findOneAndUpdate({ _id: req.params.feedId }, { $push: { likers: req.body.likerId }, $inc: { likesNo: 1 } });
    res.sendStatus(201);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post('/comment/:feedId', authorization, async function (req, res) {
  try {
    Feed.findOneAndUpdate({ _id: req.params.feedId }, { $push: { comments: { commenterId: req.body.commenterId, comment: req.body.comment } }, $inc: { commentsNo: 1 } });
    res.status(201).json(feeds);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post('/add/', authorization, async function (req, res) {
  try {
    const feed = new Feed(req.body);
    feed.save().then(() => res.sendStatus(201));
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;