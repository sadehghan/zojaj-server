const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const Course = require('../models/Course');

router.get('/', authorization, async function (req, res) {
    try {
        const courses = await Course.find({}).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched courses successfully.', data: courses });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/search', authorization, async function (req, res) {
    try {
        const re = new RegExp(req.body.regex);
        const courses = await Course.find({ news: { $regex: re } }).limit(req.body.limit);
        res.status(200).json({ status: 'successful', message: 'fetched match courses successfully.', data: courses });
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.post('/add', authorization, async function (req, res) {
    try {
        const course = new Course(req.body);
        await course.save();
        return res.status(201).json({ status: 'successful', message: 'course successfully added' });
    } catch (error) {
        return res.status(500).send({ status: 'failed', message: error.message });
    }
});

module.exports = router;