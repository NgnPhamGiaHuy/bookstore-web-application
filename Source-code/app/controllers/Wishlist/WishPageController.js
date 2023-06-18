class WishPageController{
    index(req, res){
        res.render('Wishlist/wishlist')
    }
}

module.exports = new WishPageController
