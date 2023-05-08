class WishPageController{
    index(req, res){
        res.render('wishlist')
    }
}

module.exports = new WishPageController
