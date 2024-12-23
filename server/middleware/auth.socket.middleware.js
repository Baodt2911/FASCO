import jwt from "jsonwebtoken";

const verfifyAccessTokenSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("You're not authenticated!"));
  }
  jwt.verify(token, process.env.ACCESSTOKEN_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Token is'nt valid"));
    }
    socket.decoded = decoded;
    next();
  });
};

export { verfifyAccessTokenSocket };
