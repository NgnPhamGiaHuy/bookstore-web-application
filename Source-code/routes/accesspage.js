const express = require('express');
const router = express.Router();
const accessPageController = require('../app/controllers/Authentication/AccessPageController');

router.get('/user/login', accessPageController.showLogin);
router.get('/user/register', accessPageController.showRegister);
router.get('/user/verify', accessPageController.showVerify);

router.post('/user/login', accessPageController.login);
router.post('/user/register', accessPageController.register);

module.exports = router;
