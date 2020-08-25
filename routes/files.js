const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');
const FILE_ADDRESS = "/home/farhangi/projects/zojaj/zojaj-server/public/";

router.get('/feeds/images/:feedId', /*authorization,*/ async function (req, res) {
    try {
        res.status(200).sendFile(FILE_ADDRESS + 'feeds/images/' + req.params.feedId + '.jpg');
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});

router.get('/feeds/logos/:source', /*authorization,*/ async function (req, res) {
    try {
        res.status(200).sendFile(FILE_ADDRESS + 'feeds/logos/' + req.params.source + '.png');
    } catch (error) {
        res.status(500).send({ status: 'failed', message: error.message });
    }
});


module.exports = router;
