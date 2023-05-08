class CartPageController{
    index(req, res){
        res.render('cart')
    }
}

module.exports = new CartPageController
