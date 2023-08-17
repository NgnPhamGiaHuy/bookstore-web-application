const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const userPageController = require('../../app/controllers/User/UserPageController');

function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        return res.redirect('/story-sells/user/');
    }
}

function requireUser(req, res, next) {
    if (!req.session.isAdmin) {
        next();
    } else {
        return res.redirect('/story-sells/user/admin');
    }
}

// Define routes for the admin and user interfaces
router.get('/', requireUser, userPageController.renderUserInterface);
router.get('/admin', requireAdmin, userPageController.renderAdminInterface);

router.post('/update', requireUser, userPageController.update);

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/story-sells/login');
});

module.exports = router;
