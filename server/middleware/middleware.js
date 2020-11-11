module.exports = {
    checkEmail: (req, res, next) => {
        const {username} = req.body
        if(username.includes('@') && username('.')){
            next()
        }else {
            res.status(403).send('Invalid Email Address')
        }
    },


}