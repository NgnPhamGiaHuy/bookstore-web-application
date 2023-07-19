const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const userPageController = require('../../app/controllers/User/UserPageController');

router.use(fileUpload({}));

router.get('/', userPageController.index);
router.post('/', userPageController.update);
router.post('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/story-sells/login');
});

module.exports = router;