import jwt from "jsonwebtoken";

const verfifyAccessToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "You're not authenticated!",
    });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESSTOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token is'nt valid",
      });
    }
    req.user = decoded;
    next();
  });
};
const verfifyRefreshToken = (req, res, next) => {
  const { authorization } = req.headers;
  const { rt } = req.cookies;
  if (!(authorization || rt)) {
    return res.status(401).json({
      message: "You're not authenticated!",
    });
  }
  const token = !!authorization ? authorization.split(" ")[1] : rt;
  jwt.verify(token, process.env.REFRESHTOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token is'nt valid",
      });
    }
    req.user = decoded;
    next();
  });
};
const checkAdmin = (req, res, next) => {
  verfifyAccessToken(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      res.status(403).json({
        message: "You're not authenticated!",
      });
    }
  });
};
export { verfifyAccessToken, verfifyRefreshToken, checkAdmin };
