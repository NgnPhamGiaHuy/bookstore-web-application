const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const userPageController = require('../app/controllers/UserPageController');

router.use(fileUpload({}));

router.get('/', userPageController.index);
router.post('/', userPageController.update);

module.exports = router;
