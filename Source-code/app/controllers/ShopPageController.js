class ShopPageController {
    index(req, res) {
        res.render('shop');
    }
}

module.exports = new ShopPageController();
