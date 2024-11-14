const User = require("../../models/user.model")

module.exports.auth = async (req, res, next) => {
  if(req.cookies.tokenUser){
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false,
      status: "active"
    })

    if(user){
      res.locals.user = user
    }
  }

  next()
}