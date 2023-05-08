class LoginPageController{
    index(req, res){
        res.render('login')
    }
}

module.exports = new LoginPageController
