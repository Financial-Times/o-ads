const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

module.exports = router;
