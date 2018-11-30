const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title: 'O-Ads demos',
		home: true
	});
});

router.get('/fluid', function(req, res) {
	res.render('fluid', { title: 'O-Ads demos' });
});

module.exports = router;
