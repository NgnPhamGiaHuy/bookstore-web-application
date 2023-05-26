const express = require('express');
const router = express.Router();
const searchPageController = require('../app/controllers/SearchPageController');

router.get('/', searchPageController.index)
router.post('/', searchPageController.search);


module.exports = router;
