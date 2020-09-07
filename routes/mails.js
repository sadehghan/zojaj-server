const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const Mail = require('../models/Mail');

router.post('/all', authorization, async function (req, res) {
    try {
        const mails = await Mail.find({ $or: [{ source: req.body.userId }, { destinations: req.body.userId }] }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched mails by sources successfully.', data: mails });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/unread', authorization, async function (req, res) {
    try {
        const mails = await Mail.find({ $and: [{ readers: { $nin: req.body.userId } }, { destinations: req.body.userId }] }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched unread mails by sources successfully.', data: mails });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/important', authorization, async function (req, res) {
    try {
        const mails = await Mail.find({ impotanters: req.body.userId }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched important mails by sources successfully.', data: mails });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/sent', authorization, async function (req, res) {
    try {
        const mails = await Mail.find({ source: req.body.userId }).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched sent mails by sources successfully.', data: mails });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/setimportant', authorization, async function (req, res) {
    try {
        const result = await Mail.findOneAndUpdate({ _id: req.params.mailId }, { $push: { importanters: req.body.userId } });
        res.status(200).json({ status: 'successful', message: 'mail { ' + req.params.mailId + ' } has been importanted' });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/setread', authorization, async function (req, res) {
    try {
        const result = await Mail.findOneAndUpdate({ _id: req.params.mailId }, { $push: { readers: req.body.userId } });
        res.status(200).json({ status: 'successful', message: 'mail { ' + req.params.mailId + ' } has been readed' });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/send', authorization, async function (req, res) {
    try {
        const mail = new Mail(req.body);
        await mail.save();
        return res.status(201).json({ status: 'successful', message: ' mail successfully sent.' });
    } catch (error) {
        return res.status(500).send({ status: 'failed', message: error.message });
    }
});

module.exports = router;