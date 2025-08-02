const jwt = require("jsonwebtoken");
const secret = "$uperMan@123";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // attach decoded user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authMiddleware;
