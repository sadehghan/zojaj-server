const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');

router.get('/feeds/images/:feedId', authorization, async function (req, res) {
    try {
        res.status(200).sendFile('/home/samoon/Documents/projects/react-native/zojaj-server/public/feeds/images/' + req.params.feedId + '.png');
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.get('/feeds/logos/:source', authorization, async function (req, res) {
    try {
        res.status(200).sendFile('/home/samoon/Documents/projects/react-native/zojaj-server/public/feeds/logos/' + req.params.source + '.png');
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});


module.exports = router;