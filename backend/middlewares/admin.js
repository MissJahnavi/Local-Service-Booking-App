const adminOnlyMiddleware=async (req,res,next) => {
    // console.log("Checking admin access for role:", req.user.role);
    if (req.user.role!='admin') {
        return res.status(403).json({message:'Access denied'})
    }
    next();
}

module.exports=adminOnlyMiddleware;