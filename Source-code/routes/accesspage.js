const express = require('express');
const router = express.Router();
const accessPageController = require('../app/controllers/AccessPageController');

router.get('/user/login', accessPageController.showLogin);
router.get('/user/register', accessPageController.showRegister);

router.post('/user/login', accessPageController.login);
router.post('/user/register', accessPageController.register);

module.exports = router;
