const businessOnlyMiddleware=async (req,res,next) => {
 
    if (req.user.role!='business') {
        return res.status(403).json({message:'Access denied'})
    }
    next();
}

module.exports=businessOnlyMiddleware;