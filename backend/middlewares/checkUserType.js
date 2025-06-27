export const checkUserType = (req, res, next) => {
  if (req.user && req.user.type === "host") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: User type not allowed" });
  }
};
