import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    // If the token is not present, throw an error
    if (!token) {
      throw new Error("Unauthorized Request");
    }

    // verify the token

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decodedToken === undefined) {
      throw new Error("Access token is invalid");
    }

    // check if the user exists in the database

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error("Access token is invalid");
    }

    // attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    throw new Error("Invalid token");
  }
};
