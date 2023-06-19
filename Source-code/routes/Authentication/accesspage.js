const express = require('express');
const router = express.Router();
const loginPageController = require('../../app/controllers/Authentication/LoginPageController');
const verifyPageController = require('../../app/controllers/Authentication/VerifyPageController');
const registerPageController = require('../../app/controllers/Authentication/RegisterPageController');

function requireRegister(req, res, next) {
    if (req.session.isRegistered) {
        next();
    } else {
        return res.redirect('/user/register');
    }
}

router.get('/user/login', loginPageController.showLogin);
router.get('/user/register', registerPageController.showRegister);
router.get('/user/verify/:customerId', requireRegister, verifyPageController.showVerify);

router.post('/user/login', loginPageController.getLogin);
router.post('/user/register', registerPageController.getRegister);
router.post('/user/verify/:customerId', requireRegister, verifyPageController.getVerify);

module.exports = router;
