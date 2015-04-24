var controller = {};

controller.isLoggedIn = function(req,res,next){
  if (req.isAuthenticated()){
      next();
  } else{
    res.status(401);
    res.send('not logged in');
  }
};

module.exports = controller;
