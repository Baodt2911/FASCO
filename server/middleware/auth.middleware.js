import jwt from "jsonwebtoken";

const verfifyAccessToken = (req, res, next) => {
  const { authorization } = req.header;
  if (!authorization) {
    return res.status(401).json("You're not authenticated!");
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESSTOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json("Token is'nt valid");
    }
    req.user = decoded;
    next();
  });
};
const verfifyRefreshToken = (req, res, next) => {
  const { authorization } = req.header;
  if (!authorization) {
    return res.status(401).json("You're not authenticated!");
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.REFRESHTOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json("Token is'nt valid");
    }
    req.user = decoded;
    next();
  });
};
const checkAdmin = (req, res, next) => {
  verfifyAccessToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized");
    }
  });
};
export { verfifyAccessToken, verfifyRefreshToken, checkAdmin };
