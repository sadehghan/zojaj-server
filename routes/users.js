const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization');

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

router.get('/info', authorization, function (req, res) {
  res.json(data.filter(item => item.username == req.user.username));
});

module.exports = router;