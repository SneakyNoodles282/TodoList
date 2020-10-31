function isLogged(req,res,next){
    if(!req.user){
        res.status(401).json({error:"Not Logged In "})
        return
    }
    next()
}

module.exports = {
    isLogged
}